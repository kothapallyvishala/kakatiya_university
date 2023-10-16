import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "userState",
  initialState: {
    hasError: false,
    data: {
      _id: "",
      uid: "",
      branch: "",
      dateOfJoining: "",
      dateOfPassOut: "",
      email: "",
      role: null,
      dateOfBirth: "",
      name: "",
      img: "",
    },
  },
  reducers: {
    update: (state, action) => {
      state = action.payload;
      return state;
    },
  },
});

export const { update } = userSlice.actions;
export default userSlice.reducer;
