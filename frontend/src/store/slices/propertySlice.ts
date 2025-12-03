import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import client from '../../api/client';
import { Property } from '../../types';

interface PropertyState {
  list: Property[];
  selected?: Property;
  loading: boolean;
  error?: string;
}

const initialState: PropertyState = {
  list: [],
  loading: false
};

export const fetchProperties = createAsyncThunk('properties/fetch', async (params?: Record<string, string>) => {
  const { data } = await client.get<Property[]>('/properties', { params });
  return data;
});

export const fetchPropertyById = createAsyncThunk('properties/fetchById', async (id: string) => {
  const { data } = await client.get<Property>(`/properties/${id}`);
  return data;
});

const propertySlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    resetSelected(state) {
      state.selected = undefined;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchPropertyById.fulfilled, (state, action) => {
        state.selected = action.payload;
      });
  }
});

export const { resetSelected } = propertySlice.actions;
export default propertySlice.reducer;

