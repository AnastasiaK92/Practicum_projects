import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { setCookie, deleteCookie, getCookie } from '../../utils/cookie';
import type { TUser } from '@utils-types';
import { refreshToken, registerUserApi } from '@api';
import { loginUserApi, getUserApi, resetPasswordApi } from '@api';
import { updateUserApi } from '@api';

type TUserState = {
  user: TUser | null;
  isAuth: boolean;
  loading: boolean;
  error: string | null;
  authCheked: boolean;
};

const initialState: TUserState = {
  user: null,
  isAuth: false,
  loading: false,
  error: null,
  authCheked: false
};
export const loginUser = createAsyncThunk(
  'user/login',
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const result = await loginUserApi(data);

      setCookie('accessToken', result.accessToken);
      localStorage.setItem('refreshToken', result.refreshToken);

      return result.user;
    } catch (err) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue('Login error');
    }
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async (
    data: { email: string; password: string; name: string },
    { rejectWithValue }
  ) => {
    try {
      const result = await registerUserApi(data);

      setCookie('accessToken', result.accessToken);
      localStorage.setItem('refreshToken', result.refreshToken);

      return result.user;
    } catch (err) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue('Register error');
    }
  }
);

export const getUser = createAsyncThunk(
  'user/getUser',
  async (_, { rejectWithValue }) => {
    console.log('GET USER START');
    try {
      const result = await getUserApi();
      console.log('GET USER SUCCESS', result);

      return result.user;
    } catch (err) {
      console.log('GET USER ERROR', err);
      if (err instanceof Error) return rejectWithValue(err.message);
    }
    return rejectWithValue('Get user error');
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (
    data: { name: string; email: string; password?: string },
    { rejectWithValue }
  ) => {
    try {
      const result = await updateUserApi(data);
      if (!result.success) {
        return rejectWithValue('Update failed');
      }
      return result.user;
    } catch (err) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue('Update user error');
    }
  }
);

export const checkUserAuth = createAsyncThunk(
  'user/checkAuth',
  async (_, { dispatch }) => {
    try {
      if (getCookie('accessToken')) {
        await dispatch(getUser()).unwrap();
      }
    } finally {
      dispatch(setAuthChecked(true));
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.isAuth = false;
      state.error = null;
      state.authCheked = true;

      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
    },
    setAuthChecked(state, action) {
      state.authCheked = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      //Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuth = true;
        state.authCheked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      //автовход полсе f5
      .addCase(getUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(getUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuth = true;
        state.authCheked = true;
      })
      .addCase(getUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuth = false;
        state.authCheked = true;
      })

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuth = true;
        state.authCheked = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});
export const { logout, setAuthChecked } = userSlice.actions;
export default userSlice.reducer;
