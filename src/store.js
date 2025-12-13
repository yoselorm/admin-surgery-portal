import { configureStore } from "@reduxjs/toolkit";
import surgeryReducer from "./redux/SurgerySlice";
import authReducer from './redux/AuthSlice';
import doctorReducer from './redux/DoctorSlice'

export const store = configureStore({
  reducer: {
    surgeries: surgeryReducer,
    auth: authReducer,
    doctor: doctorReducer
  }
});
