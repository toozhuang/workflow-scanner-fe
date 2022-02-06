import { configureStore } from '@reduxjs/toolkit';
import { asrHistoryReducer } from './reducer';

export const store = configureStore({
  reducer: {
    asrHistoryReducer: asrHistoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
