import { createSlice } from "@reduxjs/toolkit";

const noticeSlice = createSlice({
  name: "notice",
  initialState: {
    notices: [],
  },
  reducers: {
    addNotice: (state, action) => {
      state.notices.unshift(action.payload);
    },
  },
});

export const { addNotice } = noticeSlice.actions;
export default noticeSlice.reducer;
