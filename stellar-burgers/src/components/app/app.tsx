import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { Route, useLocation, useNavigate } from 'react-router-dom';

import { AppHeader } from '@components';
import { Preloader } from '@ui';
import { Routes } from 'react-router-dom';
import { Modal } from '@components';
import { OrderInfo } from '@components';
import { IngredientDetails } from '@components';
import { ProtectedRoute } from '@components';
import { AppDispatch, useSelector } from '../../services/store';
import { useEffect } from 'react';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { useDispatch } from 'react-redux';
import {
  checkUserAuth,
  getUser,
  setAuthChecked
} from '../../services/slices/userSlice';
import { getCookie } from '../../utils/cookie';

const App = () => {
  /** TODO: взять переменные из стора */

  const { ingredients, loading, error } = useSelector(
    (state) => state.ingredients
  );
  const isIngredientsLoading = loading;
  const location = useLocation();
  const state = location.state as { background?: Location };
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const refreshToken = localStorage.getItem('refreshToken');

  useEffect(() => {
    dispatch(fetchIngredients());

    dispatch(checkUserAuth());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      {isIngredientsLoading ? (
        <Preloader />
      ) : error ? (
        <div className={`${styles.error} text text_type_main-medium pt-4`}>
          {error}
        </div>
      ) : ingredients.length === 0 ? (
        <div className={`${styles.title} text text_type_main-medium pt-4`}>
          Нет игредиентов
        </div>
      ) : null}
      <Routes location={state?.background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {/*Модальные окна */}
      {state?.background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title='' onClose={() => navigate(-1)}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <>
                <Modal title='' onClose={() => navigate(-1)}>
                  <IngredientDetails />
                </Modal>
              </>
            }
          />

          <Route
            path='/profile/orders/:number'
            element={
              <Modal title='' onClose={() => {}}>
                <ProtectedRoute>
                  <OrderInfo />
                </ProtectedRoute>
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
