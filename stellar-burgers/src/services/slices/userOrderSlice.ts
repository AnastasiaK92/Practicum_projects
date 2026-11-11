import { getOrdersApi } from '@api';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

type TUserOrdersState = {
  orders: TOrder[];
  loading: boolean;
  error: string | null;
};

const initialState: TUserOrdersState = {
  orders: [],
  loading: false,
  error: null
};

export const fetchUserOrders = createAsyncThunk(
  'userOrders/fetch',
  async (_, { rejectWithValue }) => {
    try {
      return await getOrdersApi();
    } catch (err) {
      if (err instanceof Error) {
        return rejectWithValue('err.message');
      }
      return rejectWithValue('Failed to load user orders');
    }
  }
);

const userOrderSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export default userOrderSlice.reducer;
