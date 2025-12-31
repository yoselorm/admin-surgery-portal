import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';
import { api_url_v1 } from '../utils/config';

export const fetchSurgeries = createAsyncThunk(
  'surgery/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`${api_url_v1}/surgery`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch surgeries by doctor
export const fetchSurgeriesByDoctor = createAsyncThunk(
  'surgery/fetchByDoctor',
  async (doctorId, { rejectWithValue }) => {
    try {
      const res = await api.get(
        `${api_url_v1}/surgery/${doctorId}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch single surgery
export const fetchSurgeryById = createAsyncThunk(
  'surgery/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`${api_url_v1}/admin/surgery/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch filtered surgeries
export const fetchFilteredSurgeries = createAsyncThunk(
  'surgeries/fetchFiltered',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await api.post(`${api_url_v1}/surgeries/filter`, filters);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to filter surgeries');
    }
  }
);

// Export filtered surgeries
export const exportFilteredSurgeries = createAsyncThunk(
  'surgery/exportFiltered',
  async ({ procedure, filters }, { rejectWithValue }) => {
    try {
      const response = await api.post(`${api_url_v1}/surgery/filter-export`, {
        procedure,
        filters
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to export surgeries');
    }
  }
);

/* =======================
   SLICE
======================= */

const surgerySlice = createSlice({
  name: 'surgery',
  initialState: {
    surgeries: [],
    doctorSurgeries: [],
    currentSurgery: null,
    exportData: null,
    loading: false,
    exportLoading: false,
    error: null,
    doctor: null,
    success: false,
    count: 0,
    filteredCount: 0
  },

  reducers: {
    clearSurgeryError(state) {
      state.error = null;
    },
    clearSurgerySuccess(state) {
      state.success = false;
    },
    clearCurrentSurgery(state) {
      state.currentSurgery = null;
    },
    clearExportData(state) {
      state.exportData = null;
    }
  },

  extraReducers: (builder) => {
    builder
      /* FETCH ALL */
      .addCase(fetchSurgeries.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSurgeries.fulfilled, (state, action) => {
        state.loading = false;
        state.surgeries = action.payload;
      })
      .addCase(fetchSurgeries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* FETCH BY DOCTOR */
      .addCase(fetchSurgeriesByDoctor.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSurgeriesByDoctor.fulfilled, (state, action) => {
        state.loading = false;
        state.doctorSurgeries = action.payload.data;
        state.count = action.payload.count;
        state.doctor = action.payload.doctor;
      })
      .addCase(fetchSurgeriesByDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* FETCH ONE */
      .addCase(fetchSurgeryById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSurgeryById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSurgery = action.payload;
      })
      .addCase(fetchSurgeryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* FETCH FILTERED */
      .addCase(fetchFilteredSurgeries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilteredSurgeries.fulfilled, (state, action) => {
        state.loading = false;
        state.surgeries = action.payload;
        state.filteredCount = action.payload.length;
      })
      .addCase(fetchFilteredSurgeries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* EXPORT FILTERED */
      .addCase(exportFilteredSurgeries.pending, (state) => {
        state.exportLoading = true;
        state.error = null;
      })
      .addCase(exportFilteredSurgeries.fulfilled, (state, action) => {
        state.exportLoading = false;
        state.exportData = action.payload;
        state.success = true;
      })
      .addCase(exportFilteredSurgeries.rejected, (state, action) => {
        state.exportLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearSurgeryError,
  clearSurgerySuccess,
  clearCurrentSurgery,
  clearExportData
} = surgerySlice.actions;

export default surgerySlice.reducer;