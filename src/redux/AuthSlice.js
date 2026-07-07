// features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";
import { api_url_v1 } from "../utils/config";
import axios from "axios";

// Get admin from localStorage if exists
const adminFromStorage = localStorage.getItem('admin')
    ? JSON.parse(localStorage.getItem('admin'))
    : null;

// ---- ADMIN LOGIN ---- //
export const adminLogin = createAsyncThunk(
  "auth/adminLogin",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${api_url_v1}/admin-login`, { email, password });

      // Save accessToken, refreshToken, and admin data
      localStorage.setItem("accessToken", res?.data?.accessToken);
      localStorage.setItem("refreshToken", res?.data?.refreshToken);
      localStorage.setItem("admin", JSON.stringify(res.data.admin));

      return res.data; 
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// ---- ADMIN LOGOUT ---- //
export const logoutUser = createAsyncThunk(
    "auth/logoutUser",
    async (_, { rejectWithValue }) => {
      try {
        // No cookie to clear server-side — send the refresh token so the
        // backend can invalidate it explicitly.
        const refreshToken = localStorage.getItem("refreshToken");
        await api.post(`${api_url_v1}/logout`, { refreshToken });

        // Clear localStorage
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("admin");
        
        return true;
      } catch (err) {
        console.log(err);
        // Clear localStorage even if API call fails
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("admin");
        return rejectWithValue("Logout failed");
      }
    }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    admin: adminFromStorage, // Persist admin from localStorage
    loading: false,
    error: null,
    isSuccess: false,
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
  },
  reducers: {
    logout: (state) => {
      state.admin = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isSuccess = false;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("admin");
    },
    clearError: (state) => {
      state.error = null;
    },
    // Update tokens after the axios interceptor rotates them.
    // Note: the interceptor in api.js writes straight to localStorage on
    // every refresh without dispatching this — localStorage is the real
    // source of truth for the live token. Dispatch this only when you
    // need Redux state itself to reflect a refresh (e.g. right after
    // login, or if you add a manual "refresh on app load" flow).
    setTokens: (state, action) => {
      const { accessToken, refreshToken } = action.payload;
      if (accessToken) {
        state.accessToken = accessToken;
        localStorage.setItem('accessToken', accessToken);
      }
      if (refreshToken) {
        state.refreshToken = refreshToken;
        localStorage.setItem('refreshToken', refreshToken);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Admin Login
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isSuccess = false;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload.admin;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isSuccess = true;
        state.error = null;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.admin = null;
        state.isSuccess = false;
      })
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.admin = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.loading = false;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.admin = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.loading = false;
        state.isSuccess = false;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("admin");
      });
  },
});

export const { logout, clearError, setTokens } = authSlice.actions;

export default authSlice.reducer;