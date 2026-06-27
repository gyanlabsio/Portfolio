import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

export const fetchNewsletters = createAsyncThunk(
  'newsletter/fetchNewsletters',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/newsletter');
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch newsletters');
    }
  }
);

export const saveNewsletter = createAsyncThunk(
  'newsletter/saveNewsletter',
  async (templateData, { rejectWithValue }) => {
    try {
      let response;
      if (templateData._id) {
        response = await api.put(`/newsletter/${templateData._id}`, templateData);
      } else {
        response = await api.post('/newsletter', templateData);
      }
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to save newsletter');
    }
  }
);

export const sendNewsletter = createAsyncThunk(
  'newsletter/sendNewsletter',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/newsletter/${id}/send`);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to send newsletter');
    }
  }
);

export const deleteNewsletter = createAsyncThunk(
  'newsletter/deleteNewsletter',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/newsletter/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete newsletter');
    }
  }
);

const initialState = {
  list: [],
  loading: false,
  error: null,
};

const newsletterSlice = createSlice({
  name: 'newsletter',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewsletters.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNewsletters.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchNewsletters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(saveNewsletter.fulfilled, (state, action) => {
        const index = state.list.findIndex(t => t._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        } else {
          state.list.unshift(action.payload);
        }
      })
      .addCase(sendNewsletter.fulfilled, (state, action) => {
        const index = state.list.findIndex(t => t._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(deleteNewsletter.fulfilled, (state, action) => {
        state.list = state.list.filter(t => t._id !== action.payload);
      });
  },
});

export default newsletterSlice.reducer;
