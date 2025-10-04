import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import alertsReducer from "./alertsSlice";
import commentsReducer from "./commentsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    alerts: alertsReducer,
    comments: commentsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
