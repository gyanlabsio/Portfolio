import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  connected: false,
  lastUpdate: null,
};

const realtimeSlice = createSlice({
  name: 'realtime',
  initialState,
  reducers: {
    setConnected: (state, action) => {
      state.connected = action.payload;
    },
    setLastUpdate: (state, action) => {
      state.lastUpdate = action.payload;
    },
  },
});

export const { setConnected, setLastUpdate } = realtimeSlice.actions;

export default realtimeSlice.reducer;
