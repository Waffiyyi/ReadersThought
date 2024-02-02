import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null as any, 
    error: null as string | null,
  },
  reducers: {
    setUser: (state, action: PayloadAction<{ uid: string | null, email: string | null, displayName: string | null }>) => {
      state.user = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser: (_, action) => action.payload,
    clearUser: () => null,
  },
});
export const { setUser: setUserAuth, setError, clearError } = authSlice.actions
export const { clearUser } = userSlice.actions;

export const selectUser = (state: any) => state.auth.user; 
export const selectError = (state: any) => state.auth.error;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});

export default store;