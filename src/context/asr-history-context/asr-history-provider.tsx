/**
 * date: 2022-01-31, Mon, 11:34
 * author: TooZhun9
 * feature： 包裹 ASR History 组件， 实时的从indexeddb 里获取最新的数据
 */

import React, { useReducer } from 'react';
import { asrHistoryInitialState, AsrHistoryReducer } from './reducer';

const AsrHistoryContext = React.createContext(asrHistoryInitialState);
const AsrHistoryDispatchContext = React.createContext({});

/**
 * 创建一个专门包裹 asr page 的 provider
 * 用来全局处理需要的数据 里面有我全局会用到的
 * 方法
 */
const AsrHistoryProvider = ({ children }: { children: JSX.Element }) => {
  const [asrHistoryStore, dispatch] = useReducer(
    AsrHistoryReducer,
    asrHistoryInitialState,
  );

  return (
    <AsrHistoryContext.Provider value={asrHistoryStore}>
      <AsrHistoryDispatchContext.Provider value={dispatch}>
        {children}
      </AsrHistoryDispatchContext.Provider>
    </AsrHistoryContext.Provider>
  );
};

export default AsrHistoryProvider;
