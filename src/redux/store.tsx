import { configureStore } from '@reduxjs/toolkit';
import { createActionListenerMiddleware } from '@rtk-incubator/action-listener-middleware';
import { asrHistoryReducer } from './reducer';
import { useSelector } from 'react-redux';

const actionListenerMiddleware = createActionListenerMiddleware({
  onError: () => console.error('error: '),
});

export const store = configureStore({
  reducer: {
    asrHistoryReducer: asrHistoryReducer,
  },
  middleware: gDM => gDM().prepend(actionListenerMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAsrHistorySelector = useSelector;

// note: https://github.com/reduxjs/redux-toolkit/blob/f86d1e668b680bc3a47b5a488b6abf0d158e58ae/examples/action-listener/counter/src/store.ts
// 中还有很多例子可以参考， 但这里我们只保持 最基本的 store 创建来进行
