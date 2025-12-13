// features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";
import { api_url_v1 } from "../utils/config";

// Get admin from localStorage if exists
const adminFromStorage = localStorage.getItem('admin')
    ? JSON.parse(localStorage.getItem('admin'))
    : null;

// ---- ADMIN LOGIN ---- //
export const adminLogin = createAsyncThunk(
  "auth/adminLogin",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await api.post(`${api_url_v1}/admin-login`, { email, password });

      // Save accessToken and admin data
      localStorage.setItem("accessToken", res?.data?.accessToken);
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
        await api.post(`${api_url_v1}/logout`);
        
        // Clear localStorage
        localStorage.removeItem("accessToken");
        localStorage.removeItem("admin");
        
        return true;
      } catch (err) {
        console.log(err);
        // Clear localStorage even if API call fails
        localStorage.removeItem("accessToken");
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
    accessToken:localStorage.getItem('accessToken')
  },
  reducers: {
    logout: (state) => {
      state.admin = null;
      state.isSuccess = false;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("admin");
    },
    clearError: (state) => {
      state.error = null;
    },
    // Update access token after refresh
    refreshAccessToken: (state, action) => {
      localStorage.setItem('accessToken', action.payload);
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
        state.accessToken = '';
        state.loading = false;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.admin = null;
        state.loading = false;
        state.isSuccess = false;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("admin");
      });
  },
});

export const { logout, clearError, refreshAccessToken } = authSlice.actions;

export default authSlice.reducer;