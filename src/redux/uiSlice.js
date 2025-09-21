import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // example state
  theme: 'light',
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // example reducer
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
  },
});

export const { toggleTheme } = uiSlice.actions;

export default uiSlice.reducer;

