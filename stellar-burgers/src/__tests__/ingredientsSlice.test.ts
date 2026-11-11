import reducer, { fetchIngredients } from '../services/slices/ingredientsSlice';
import { TIngredient } from '../utils/types';

describe('ingredients reducer', () => {
  test('возвращает initialState при неизвестном экшене', () => {
    expect(reducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual({
      ingredients: [],
      loading: false,
      error: null
    });
  });
  test('обрабатывает pending', () => {
    const state = {
      ingredients: [],
      loading: false,
      error: 'Ошибка'
    };

    const newState = reducer(state, fetchIngredients.pending('', undefined));

    expect(newState).toEqual({
      ingredients: [],
      loading: true,
      error: null
    });
  });
  test('обрабатывает fulfilled', () => {
    const ingredient: TIngredient = {
      _id: '1',
      name: 'Булка',
      type: 'bun',
      proteins: 10,
      fat: 20,
      carbohydrates: 30,
      calories: 400,
      price: 100,
      image: 'image',
      image_large: 'image_large',
      image_mobile: 'image_mobile'
    };
    const ingredients = [ingredient];

    const state = { ingredients: [], loading: true, error: null };

    const newState = reducer(
      state,
      fetchIngredients.fulfilled(ingredients, '', undefined)
    );

    expect(newState).toEqual({ ingredients, loading: false, error: null });
  });

  test('обрабатывает rejected', () => {
    const state = {
      ingredients: [],
      loading: true,
      error: null
    };

    const newState = reducer(
      state,
      fetchIngredients.rejected(null, '', undefined)
    );

    expect(newState).toEqual({
      ingredients: [],
      loading: false,
      error: 'Ошибка загрузки ингрeдиентов'
    });
  });
});
