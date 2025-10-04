const BASE_URL = "https://khoya.onrender.com";

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface Alert {
  id: number;
  title: string;
  description: string;
  location: string;
  imageUrl: string;
  status: string;
  reportCount: number;
  createdAt: string;
  updatedAt: string;
  postedBy: {
    id: number;
    name: string;
    email: string;
  };
}

export interface AlertsState {
  alerts: Alert[];
  status: "idle" | "loading" | "success" | "error";
  error: string | null;
  reportStatus: "idle" | "loading" | "success" | "error";
  reportError: string | null;
  reportSuccess: string | null;
}

const initialState: AlertsState = {
  alerts: [],
  status: "idle",
  error: null,
  reportStatus: "idle",
  reportError: null,
  reportSuccess: null,
};

export const fetchAlerts = createAsyncThunk<Alert[]>(
  "alerts/fetchAlerts",
  async () => {
    const res = await fetch(`${BASE_URL}/api/alerts`);
    const data = await res.json();
    return data.alerts;
  }
);

export const submitMissingPersonReport = createAsyncThunk<
  any, // You can type this according to your API response
  { formData: FormData; accessToken: string },
  { rejectValue: string }
>(
  "alerts/submitMissingPersonReport",
  async ({ formData, accessToken }, thunkAPI) => {
    try {
      const res = await fetch(`${BASE_URL}/api/alerts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok)
        return thunkAPI.rejectWithValue(
          data.message || "Failed to submit report"
        );
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue("Network error. Please try again.");
    }
  }
);

const alertsSlice = createSlice({
  name: "alerts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlerts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchAlerts.fulfilled,
        (state, action: PayloadAction<Alert[]>) => {
          state.status = "success";
          state.alerts = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchAlerts.rejected, (state, action) => {
        state.status = "error";
        state.error = action.error.message || "Failed to fetch alerts";
      })
      .addCase(submitMissingPersonReport.pending, (state) => {
        state.reportStatus = "loading";
        state.reportError = null;
        state.reportSuccess = null;
      })
      .addCase(submitMissingPersonReport.fulfilled, (state, action) => {
        state.reportStatus = "success";
        state.reportSuccess = "Report submitted successfully!";
      })
      .addCase(submitMissingPersonReport.rejected, (state, action) => {
        state.reportStatus = "error";
        state.reportError = action.payload as string;
      });
  },
});

export default alertsSlice.reducer;
