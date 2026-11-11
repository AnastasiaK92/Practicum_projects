import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { TIngredient } from '@utils-types';
import { getIngredientsApi } from '@api';

//состояние slice
type TIngredientState = {
  ingredients: TIngredient[];
  loading: boolean;
  error: string | null;
};
//начальное состояние
const initialState: TIngredientState = {
  ingredients: [],
  loading: false,
  error: null
};
//thunk -запрос ингридиентов.
export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async () => {
    const res = await getIngredientsApi();

    return res;
  }
);
//slice
const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchIngredients.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchIngredients.fulfilled, (state, action) => {
      state.loading = false;
      state.ingredients = action.payload;
    });
    builder.addCase(fetchIngredients.rejected, (state) => {
      state.loading = false;
      state.error = 'Ошибка загрузки ингрeдиентов';
    });
  }
});

export default ingredientsSlice.reducer;
