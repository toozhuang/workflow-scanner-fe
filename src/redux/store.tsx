/**
 * date: 2022-02-22, Tue, 16:21
 * author: TooZhun9
 * feature： 全局 store， 包含了 asr-history reducer
 */
import { configureStore } from '@reduxjs/toolkit';
import { createActionListenerMiddleware } from '@rtk-incubator/action-listener-middleware';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { asrHistorySlice } from './asrHistory-slice';

const actionListenerMiddleware = createActionListenerMiddleware({
  onError: () => console.error('error: '),
});

export const store = configureStore({
  reducer: {
    [asrHistorySlice.name]: asrHistorySlice.reducer,
  },
  middleware: gDM => gDM().prepend(actionListenerMiddleware),
});

//----- define types

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

// ----- define functions
export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// note: https://github.com/reduxjs/redux-toolkit/blob/f86d1e668b680bc3a47b5a488b6abf0d158e58ae/examples/action-listener/counter/src/store.ts
// 中还有很多例子可以参考， 但这里我们只保持 最基本的 store 创建来进行
