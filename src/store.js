import { configureStore } from "@reduxjs/toolkit";
import surgeryReducer from "./redux/SurgerySlice";

export const store = configureStore({
  reducer: {
    surgeries: surgeryReducer
  }
});
