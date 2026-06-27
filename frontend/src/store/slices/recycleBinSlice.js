import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

export const fetchTrash = createAsyncThunk(
  'recycleBin/fetchTrash',
  async (moduleName, { rejectWithValue }) => {
    try {
      const endpoint = moduleName ? `/trash?module=${moduleName}` : '/trash';
      const response = await api.get(endpoint);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch trash items');
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const recycleBinSlice = createSlice({
  name: 'recycleBin',
  initialState,
  reducers: {
    removeItemsLocally: (state, action) => {
      const idsToRemove = action.payload; // Array of IDs
      state.items = state.items.filter(item => !idsToRemove.includes(item._id));
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrash.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrash.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTrash.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { removeItemsLocally } = recycleBinSlice.actions;
export default recycleBinSlice.reducer;
