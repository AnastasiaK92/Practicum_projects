import reducer, {
  addIngredient,
  clearConstructor,
  removeIngredient,
  moveIngredient
} from '../services/slices/constructorSlice';

import { TConstructorIngredient } from '../utils/types';

const bun: TConstructorIngredient = {
  _id: '1',
  id: 'bun-1',
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

const ingredientA: TConstructorIngredient = {
  _id: '2',
  id: 'ingredient-1',
  name: 'Котлета',
  type: 'main',
  proteins: 20,
  fat: 15,
  carbohydrates: 5,
  calories: 250,
  price: 150,
  image: 'image',
  image_large: 'image_large',
  image_mobile: 'image_mobile'
};

const ingredientB: TConstructorIngredient = {
  _id: '3',
  id: 'ingredient-2',
  name: 'Сыр',
  type: 'main',
  proteins: 15,
  fat: 10,
  carbohydrates: 2,
  calories: 180,
  price: 80,
  image: 'image',
  image_large: 'image_large',
  image_mobile: 'image_mobile'
};

describe('constructor reducer', () => {
  test('возвращает initialState при неизвестном экшене', () => {
    expect(reducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual({
      bun: null,
      ingredients: []
    });
  });

  test('добавляет булку', () => {
    const state = {
      bun: null,
      ingredients: []
    };

    const newState = reducer(state, addIngredient(bun));

    expect(newState).toEqual({
      bun,
      ingredients: []
    });
  });

  test('добавляет ингридиент', () => {
    const state = {
      bun: null,
      ingredients: []
    };

    const newState = reducer(state, addIngredient(ingredientA));

    expect(newState).toEqual({
      bun: null,
      ingredients: [ingredientA]
    });
  });

  test('удаляет ингридиент', () => {
    const state = {
      ingredients: [ingredientA, ingredientB],
      bun: null
    };

    const newState = reducer(state, removeIngredient(ingredientA.id));

    expect(newState).toEqual({
      ingredients: [ingredientB],
      bun: null
    });
  });

  test('изменение порядка', () => {
    const state = {
      bun: null,
      ingredients: [ingredientA, ingredientB]
    };

    const newState = reducer(state, moveIngredient({ from: 0, to: 1 }));

    expect(newState.ingredients).toEqual([ingredientB, ingredientA]);
  });

  test('очищает конструктор', () => {
    const state = {
      bun,
      ingredients: [ingredientA, ingredientB]
    };

    const newState = reducer(state, clearConstructor());

    expect(newState).toEqual({ bun: null, ingredients: [] });
  });
});
