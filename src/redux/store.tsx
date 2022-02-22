import { configureStore } from '@reduxjs/toolkit';
import { createActionListenerMiddleware } from '@rtk-incubator/action-listener-middleware';
import { asrHistoryReducer } from './reducer';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { asrHistorySlice } from './asrHistory-slice';

const actionListenerMiddleware = createActionListenerMiddleware({
  onError: () => console.error('error: '),
});

export const store = configureStore({
  reducer: {
    asrHistoryReducer: asrHistoryReducer,
    [asrHistorySlice.name]: asrHistorySlice.reducer,
  },
  middleware: gDM => gDM().prepend(actionListenerMiddleware),
});

console.log('这和看一下: ', store);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAsrHistorySelector = useSelector;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// note: https://github.com/reduxjs/redux-toolkit/blob/f86d1e668b680bc3a47b5a488b6abf0d158e58ae/examples/action-listener/counter/src/store.ts
// 中还有很多例子可以参考， 但这里我们只保持 最基本的 store 创建来进行
