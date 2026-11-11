import React, { FC, memo } from 'react';
import { Link } from 'react-router-dom';
import styles from './burger-ingredient.module.css';
import { useDispatch } from '../../../services/store';
import { addIngredient } from '../../../services/slices/constructorSlice';
import { v4 as uuidv4 } from 'uuid';
import { useLocation } from 'react-router-dom';

import {
  Counter,
  CurrencyIcon,
  AddButton
} from '@zlden/react-developer-burger-ui-components';

import { TBurgerIngredientUIProps } from './type';

export const BurgerIngredientUI: FC<TBurgerIngredientUIProps> = memo(
  ({ ingredient, count }) => {
    const dispatch = useDispatch();
    const location = useLocation();

    const handleAdd = () => {
      dispatch(addIngredient({ ...ingredient, id: uuidv4() }));
    };
    const { image, price, name, _id } = ingredient;

    return (
      <li
        className={styles.container}
        data-testid={`ingredient-${ingredient.type}`}
      >
        <Link
          className={styles.article}
          to={`/ingredients/${_id}`}
          state={{ background: location }}
        >
          {count && <Counter count={count} />}
          <img className={styles.img} src={image} alt='картинка ингредиента.' />
          <div className={`${styles.cost} mt-2 mb-2`}>
            <p className='text text_type_digits-default mr-2'>{price}</p>
            <CurrencyIcon type='primary' />
          </div>
          <p
            data-testid='ingredient-name'
            className={`text text_type_main-default ${styles.text}`}
          >
            {name}
          </p>
        </Link>
        <AddButton
          data-testid='ingredient-item'
          text='Добавить'
          onClick={handleAdd}
          extraClass={`${styles.addButton} mt-8`}
        />
      </li>
    );
  }
);
