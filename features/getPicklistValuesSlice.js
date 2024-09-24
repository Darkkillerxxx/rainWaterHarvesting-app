// dataSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Thunk for async API call
export const fetchPicklistValues = createAsyncThunk('data/fetchPicklistValues', async () => {
  const response = await fetch('https://rainwaterharvesting-backend.onrender.com/getPicklistValues');
  console.log(7);
  const data = await response.json();
  return data;
});

const getPicklistValuesSlice = createSlice({
  name: 'data',
  initialState: {
    loading: false,
    data: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPicklistValues.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPicklistValues.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchPicklistValues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default getPicklistValuesSlice.reducer;
