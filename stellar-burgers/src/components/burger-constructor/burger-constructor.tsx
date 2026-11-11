import { FC, useMemo } from 'react';
import { TConstructorIngredient, TOrder } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector } from '../../services/store';
import { TIngredient } from '@utils-types';
import { useDispatch } from '../../services/store';
import { createOrder } from '../../services/slices/orderSlice';
import { cleanOrder } from '../../services/slices/orderSlice';
import { clearConstructor } from '../../services/slices/constructorSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuth = useSelector((state) => state.user.isAuth);
  const { bun, ingredients } = useSelector((state) => state.burgerConstructor);

  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const { createdOrder, loading } = useSelector((state) => state.order);
  const orderRequest = loading;

  const orderModalData = createdOrder
    ? ({ number: createdOrder.number } as TOrder)
    : null;

  const onOrderClick = () => {
    if (!bun || orderRequest) return;
    if (!isAuth) {
      navigate('/login');
      return;
    }

    const ids = [bun._id, ...ingredients.map((item) => item._id), bun._id];
    dispatch(createOrder(ids))
      .unwrap()
      .then(() => {
        dispatch(clearConstructor());
      });
  };

  const closeOrderModal = () => {
    dispatch(cleanOrder());
  };

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce((s: number, v: TIngredient) => s + v.price, 0),
    [bun, ingredients]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={{ bun, ingredients }}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
