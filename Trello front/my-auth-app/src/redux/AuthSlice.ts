import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Navigate } from "react-router-dom";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      localStorage.removeItem("selectedProject");
    },
  },
});

export const { setAuthTokens, logout } = authSlice.actions;
export default authSlice.reducer;
