import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null as any,
    error: null as string | null,
  },
  reducers: {
    setUserAuth: (state, action: PayloadAction<{ uid: string | null; email: string | null; displayName: string | null }>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { setUserAuth, clearUser, setError, clearError } = authSlice.actions;

// Selectors
export const selectUser = (state: RootState) => state.auth.user;
export const selectError = (state: RootState) => state.auth.error;

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;