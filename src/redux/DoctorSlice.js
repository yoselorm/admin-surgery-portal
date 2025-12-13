import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";



export const addDoctor = createAsyncThunk(
  "doctor/addDoctor",
  async (doctorData, { rejectWithValue }) => {
    try {
      const res = await api.post("/register", doctorData);
      return res.data
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to add doctor"
      );
    }
  }
);


export const updateDoctor = createAsyncThunk(
  "doctor/updateDoctor",
  async ({ id, data }, { rejectWithValue }) => {
    console.log(data)
    try {
      const res = await api.post(`/users/${id}`, data);
      return res.data; 
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update doctor"
      );
    }
  }
);

export const getAllDoctors = createAsyncThunk(
    "doctor/getAllDoctors",
    async (_, { rejectWithValue }) => {
      try {
        const res = await api.get("/users");
        return res.data.users; 
      } catch (err) {
        return rejectWithValue(
          err.response?.data?.message || "Failed to fetch doctors"
        );
      }
    }
  );


const doctorSlice = createSlice({
  name: "doctor",
  initialState: {
    doctors: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearDoctorError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      /* ---- ADD ---- */
      .addCase(addDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addDoctor.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors.unshift(action.payload.user);
      })
      .addCase(addDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---- UPDATE ---- */
      .addCase(updateDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDoctor.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.doctors.findIndex(
          (doc) => doc._id === action.payload.user._id
        );
        if (index !== -1) {
          state.doctors[index] = action.payload.user;
        }
      })
      .addCase(updateDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(getAllDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload;
      })
      .addCase(getAllDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDoctorError } = doctorSlice.actions;
export default doctorSlice.reducer;
