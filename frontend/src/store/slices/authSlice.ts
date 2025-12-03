import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import client from '../../api/client';
import { User } from '../../types';

interface AuthState {
  user?: User;
  status: 'idle' | 'loading' | 'failed';
  error?: string;
}

const initialState: AuthState = {
  status: 'idle'
};

export const fetchCurrentUser = createAsyncThunk('auth/me', async (_, thunkApi) => {
  try {
    const { data } = await client.get<User>('/auth/me');
    return data;
  } catch (error: any) {
    return thunkApi.rejectWithValue(error.response?.data?.message ?? 'Cannot fetch profile');
  }
});

export const googleLogin = createAsyncThunk('auth/google', async (idToken: string, thunkApi) => {
  try {
    const { data } = await client.post('/auth/google', { idToken });
    return data.user as User;
  } catch (error: any) {
    return thunkApi.rejectWithValue(error.response?.data?.message ?? 'Login failed');
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, thunkApi) => {
  try {
    await client.post('/auth/logout');
    return;
  } catch (error: any) {
    // Even if logout fails on server, clear local state
    return thunkApi.fulfillWithValue(undefined);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutSuccess(state) {
      state.user = undefined;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = 'idle';
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'idle';
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = undefined;
        state.status = 'idle';
        state.error = undefined;
      });
  }
});

export const { logoutSuccess } = authSlice.actions;
export default authSlice.reducer;

