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
  lastFetched: number | null; // Track when data was last fetched
}

const initialState: AlertsState = {
  alerts: [],
  status: "idle",
  error: null,
  reportStatus: "idle",
  reportError: null,
  reportSuccess: null,
  lastFetched: null,
};

// Fetch alerts with optional force refresh
export const fetchAlerts = createAsyncThunk<
  Alert[],
  { forceRefresh?: boolean } | undefined, // <-- FIX: Changed `void` to `undefined` here
  { state: { alerts: AlertsState } }
>(
  "alerts/fetchAlerts",
  async (params, thunkAPI) => {
    // `params` will be `{ forceRefresh?: boolean } | undefined` now
    const forceRefresh = params?.forceRefresh ?? false;
    const state = thunkAPI.getState().alerts;

    // If we have data and it's recent (less than 5 minutes old), skip fetch
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
    if (
      !forceRefresh &&
      state.lastFetched &&
      Date.now() - state.lastFetched < CACHE_DURATION &&
      state.alerts.length > 0
    ) {
      // Use fulfillWithValue to return cached data without hitting the network
      return thunkAPI.fulfillWithValue(state.alerts);
    }

    const res = await fetch(`${BASE_URL}/api/alerts`);
    const data = await res.json();
    return data.alerts;
  },
  {
    condition: (params, { getState }) => {
      const { alerts } = getState();
      // This line is now correctly typed as `params` includes `undefined`
      const forceRefresh = params?.forceRefresh ?? false;

      // Prevent duplicate concurrent requests
      if (alerts.status === "loading" && !forceRefresh) {
        return false;
      }
      return true;
    },
  }
);

export const submitMissingPersonReport = createAsyncThunk<
  any,
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
  reducers: {
    // Manual action to clear cache and force refresh on next fetch
    invalidateAlertsCache: (state) => {
      state.lastFetched = null;
    },
  },
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
          state.lastFetched = Date.now();
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
        // Invalidate cache so next fetch gets fresh data
        state.lastFetched = null;
      })
      .addCase(submitMissingPersonReport.rejected, (state, action) => {
        state.reportStatus = "error";
        state.reportError = action.payload as string;
      });
  },
});

export const { invalidateAlertsCache } = alertsSlice.actions;
export default alertsSlice.reducer;
