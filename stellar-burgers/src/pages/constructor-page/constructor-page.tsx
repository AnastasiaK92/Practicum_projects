import { useSelector } from '../../services/store';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../services/store';

import styles from './constructor-page.module.css';

import { BurgerIngredients } from '../../components';
import { BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';
import { FC } from 'react';
import { useEffect } from 'react';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';

export const ConstructorPage: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state) => state.ingredients.loading);

  return (
    <main className={styles.containerMain}>
      <h1
        className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
      >
        Соберите бургер
      </h1>
      <div className={`${styles.main} pl-5 pr-5`}>
        {loading ? <Preloader /> : <BurgerIngredients />}
        <BurgerConstructor />
      </div>
    </main>
  );
};
