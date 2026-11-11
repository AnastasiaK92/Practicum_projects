import { FC, ReactElement, ReactNode } from 'react';
import { useSelector } from '../../services/store';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '@ui';
type TProtectedRouteProps = {
  children: React.ReactNode;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: TProtectedRouteProps) => {
  const userState = useSelector((state) => state.user);
  console.log('USERSTATE', userState);
  const isAuth = useSelector((state) => state.user.isAuth);
  const authChecked = useSelector((state) => state.user.authCheked);
  const location = useLocation();
  console.log('ProtectedRoute', {
    isAuth,
    authChecked,
    onlyUnAuth,
    pathname: location.pathname
  });
  if (!authChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !isAuth) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }
  if (onlyUnAuth && isAuth) {
    const from = location.state?.from || { pathname: '/' };

    return <Navigate replace to={from} />;
  }
  return children;
};
