import { createSlice } from "@reduxjs/toolkit";

export const modalSlice = createSlice({
  name: "modalState",
  initialState: {
    isOpen: false,
  },
  reducers: {
    toggle: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { toggle } = modalSlice.actions;
export default modalSlice.reducer;
