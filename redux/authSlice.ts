const BASE_URL = "https://khoya.onrender.com";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface AuthState {
  accessToken: string;
  refreshToken: string;
  userId: number | null;
  name: string;
  email: string;
  role: string;
  status: "idle" | "loading" | "success" | "error";
  error: string | null;
}

// Load initial state from localStorage
const loadAuthFromStorage = (): Partial<AuthState> => {
  if (typeof window === "undefined") return {};

  try {
    const saved = localStorage.getItem("authState");
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error("Failed to load auth state:", error);
  }
  return {};
};

const initialState: AuthState = {
  accessToken: "",
  refreshToken: "",
  userId: null,
  name: "",
  email: "",
  role: "",
  status: "idle",
  error: null,
  ...loadAuthFromStorage(), // Restore saved auth
};

// Helper to persist auth state
const persistAuthState = (state: AuthState) => {
  if (typeof window === "undefined") return;

  try {
    const { status, error, ...authData } = state;
    localStorage.setItem("authState", JSON.stringify(authData));
  } catch (error) {
    console.error("Failed to persist auth state:", error);
  }
};

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (
    payload: { name: string; email: string; password: string },
    thunkAPI
  ) => {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok)
      return thunkAPI.rejectWithValue(data.message || "Registration failed");
    return data;
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (payload: { email: string; password: string }, thunkAPI) => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok)
      return thunkAPI.rejectWithValue(data.message || "Login failed");
    return data;
  }
);

export const refreshAuthToken = createAsyncThunk(
  "auth/refreshToken",
  async (refreshToken: string, thunkAPI) => {
    const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    const data = await res.json();
    if (!res.ok)
      return thunkAPI.rejectWithValue(data.message || "Token refresh failed");
    return data;
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (
    {
      accessToken,
      refreshToken,
    }: { accessToken: string; refreshToken: string },
    thunkAPI
  ) => {
    const res = await fetch(`${BASE_URL}/api/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ refreshToken }),
    });
    const data = await res.json();
    if (!res.ok)
      return thunkAPI.rejectWithValue(data.message || "Logout failed");
    return data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuth: (state) => {
      Object.assign(state, {
        accessToken: "",
        refreshToken: "",
        userId: null,
        name: "",
        email: "",
        role: "",
        status: "idle",
        error: null,
      });
      if (typeof window !== "undefined") {
        localStorage.removeItem("authState");
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "success";
        state.error = null;
        Object.assign(state, action.payload);
        persistAuthState(state);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "success";
        state.error = null;
        Object.assign(state, action.payload);
        persistAuthState(state);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload as string;
      })
      .addCase(refreshAuthToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        persistAuthState(state);
      })
      .addCase(logoutUser.fulfilled, (state) => {
        Object.assign(state, {
          accessToken: "",
          refreshToken: "",
          userId: null,
          name: "",
          email: "",
          role: "",
          status: "idle",
          error: null,
        });
        if (typeof window !== "undefined") {
          localStorage.removeItem("authState");
        }
      });
  },
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;
