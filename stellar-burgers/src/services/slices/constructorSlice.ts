import type { TConstructorIngredient, TIngredient } from '@utils-types';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

type TConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient(state, action: PayloadAction<TConstructorIngredient>) {
      if (action.payload.type === 'bun') {
        state.bun = action.payload;
      } else {
        state.ingredients = [...state.ingredients, action.payload];
      }
    },
    removeIngredient(state, action: PayloadAction<string>) {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },

    moveIngredient(state, action: PayloadAction<{ from: number; to: number }>) {
      const { from, to } = action.payload;
      const item = state.ingredients[from];
      state.ingredients.splice(from, 1);
      state.ingredients.splice(to, 0, item);
    },

    clearConstructor(state) {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = constructorSlice.actions;

export default constructorSlice.reducer;
