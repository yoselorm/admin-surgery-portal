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

// 4. Fetch surgeries by doctor
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

// 5. Fetch single surgery
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

/* =======================
   SLICE
======================= */

const surgerySlice = createSlice({
  name: 'surgery',
  initialState: {
    surgeries: [],
    doctorSurgeries:[],
    currentSurgery: null,
    loading: false,
    error: null,
    doctor:null,
    success: false,
    count: 0
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
        state.doctor = action.payload.doctor
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
      });
  },
});

export const {
  clearSurgeryError,
  clearSurgerySuccess,
  clearCurrentSurgery,
} = surgerySlice.actions;

export default surgerySlice.reducer;
