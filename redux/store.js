import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import modalReducer from "./modalSlice";

export default configureStore({
  reducer: {
    userState: userReducer,
    modalState: modalReducer,
  },
});
