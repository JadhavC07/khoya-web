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
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

interface AlertsApiResponse {
  alerts: Alert[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

const initialState: AlertsState = {
  alerts: [],
  status: "idle",
  error: null,
  reportStatus: "idle",
  reportError: null,
  reportSuccess: null,
  lastFetched: null,
  page: 0,
  size: 10,
  totalElements: 0,
  totalPages: 0,
  first: true,
  last: false,
};

// Fetch alerts with optional force refresh
export const fetchAlerts = createAsyncThunk<
  AlertsApiResponse,
  { forceRefresh?: boolean; page?: number; size?: number } | undefined,
  { state: { alerts: AlertsState } }
>(
  "alerts/fetchAlerts",
  async (params, thunkAPI) => {
    const forceRefresh = params?.forceRefresh ?? false;
    const state = thunkAPI.getState().alerts;
    const page = params?.page ?? 0;
    const size = params?.size ?? 10;

    // If we have data and it's recent (less than 5 minutes old), skip fetch
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
    if (
      !forceRefresh &&
      state.lastFetched &&
      Date.now() - state.lastFetched < CACHE_DURATION &&
      state.alerts.length > 0
    ) {
      return thunkAPI.fulfillWithValue(state.alerts);
    }

    const res = await fetch(`${BASE_URL}/api/alerts?page=${page}&size=${size}`);
    const data = await res.json();
    return data;
  },
  {
    condition: (params, { getState }) => {
      const { alerts } = getState();
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
        (state, action: PayloadAction<AlertsApiResponse>) => {
          state.status = "success";
          state.alerts = action.payload.alerts || [];
          state.error = null;
          state.lastFetched = Date.now();
          state.page = action.payload.page;
          state.size = action.payload.size;
          state.totalElements = action.payload.totalElements;
          state.totalPages = action.payload.totalPages;
          state.first = action.payload.first;
          state.last = action.payload.last;
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
        state.page = 0;
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
