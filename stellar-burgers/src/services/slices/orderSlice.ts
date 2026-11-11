import { orderBurgerApi, TNewOrder } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getOrderByNumberApi } from '@api';

type TOrderState = {
  order: TOrder | null;
  createdOrder: TNewOrder | null;
  loading: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  order: null,
  createdOrder: null,
  loading: false,
  error: null
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredients: string[], { rejectWithValue }) => {
    try {
      const res = await orderBurgerApi(ingredients);
      return res.order;
    } catch (err) {
      if (err instanceof Error) {
        return rejectWithValue('err.message');
      }
      return rejectWithValue('order error');
    }
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchByNumber',
  async (number: number, { rejectWithValue }) => {
    try {
      const res = await getOrderByNumberApi(number);

      if (!res?.orders?.length) {
        return rejectWithValue('Order not found');
      }
      return res.orders[0];
    } catch (err) {
      return rejectWithValue('Failed to load order');
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    cleanOrder(state) {
      state.createdOrder = null;
      state.order = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.createdOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { cleanOrder } = orderSlice.actions;

export default orderSlice.reducer;
