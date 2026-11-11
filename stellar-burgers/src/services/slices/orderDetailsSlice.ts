import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { TOrder } from '@utils-types';
import { getOrderByNumberApi } from '@api';

type TOrderState = {
  order: TOrder | null;
  loading: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  order: null,
  loading: false,
  error: null
};
export const fetchOrderByNumber = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('order/fetchByNumber', async (number, { rejectWithValue }) => {
  try {
    const res = await getOrderByNumberApi(number);

    if (!res?.orders?.length) {
      return rejectWithValue('Order not found');
    }
    return res.orders[0];
  } catch (err) {
    return rejectWithValue('Failed to load order');
  }
});
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder(state) {
      state.order = null;
      state.order = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchOrderByNumber.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchOrderByNumber.fulfilled, (state, action) => {
      state.loading = false;
      state.order = action.payload;
    });
    builder.addCase(fetchOrderByNumber.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? 'Error';
    });
  }
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
