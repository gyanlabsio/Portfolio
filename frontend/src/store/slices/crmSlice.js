import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  contacts: [],
  total: 0,
  page: 1,
  pages: 1,
  selectedContact: null,
  companies: [],
  tags: [],
  customFields: [],
  loading: false,
  error: null,
};

const crmSlice = createSlice({
  name: 'crm',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setContacts: (state, action) => {
      state.contacts = action.payload.data;
      state.total = action.payload.total;
      state.page = action.payload.page;
      state.pages = action.payload.pages;
      state.error = null;
    },
    setSelectedContact: (state, action) => {
      state.selectedContact = action.payload;
    },
    setCompanies: (state, action) => {
      state.companies = action.payload;
    },
    setTags: (state, action) => {
      state.tags = action.payload;
    },
    setCustomFields: (state, action) => {
      state.customFields = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    }
  },
});

export const { 
  setLoading, 
  setContacts, 
  setSelectedContact, 
  setCompanies, 
  setTags, 
  setCustomFields, 
  setError 
} = crmSlice.actions;

export default crmSlice.reducer;
