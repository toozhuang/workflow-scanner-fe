/**
 * 存储当前整个系统中需要的集合数据
 */
import React, { useReducer } from 'react';
import {
  asrInitialState,
  AsrReducer,
  AuthReducer,
  initialState,
} from './reducer';

// import dev_env from '../../src/config.env';
// import prod_env from '../../src/config.prod';

// const isDev = process.env.NODE_ENV === 'development';
// const configuration = isDev
//   ? dev_env.cloud.huawei.accessKeyId
//   : prod_env.cloud.huawei.accessKeyId;

//  Auth 部分的 Context Wrapper
const AuthStateContext = React.createContext(initialState);
// TODO: 这个地方需要判断一下 现在只是默认的简单传入一个 空进去
const AuthDispatchContext = React.createContext({}); //Dispatch<ActionType>

// ASR 部分的全局 Context
const AsrStateContext = React.createContext(asrInitialState); // 即使我现在在这个地方有了我们的state， 但其实最终
// 在使用的时候， 还是从那个 reducer hook 中拿取 更快更简单更牛逼啊
// {description:'这是 deafult reducer with nothing pass'} TODO: 强调确实需要找一下这个是要传入什么
const AsrDispatchContext = React.createContext({});

export function useAsrState() {
  const context = React.useContext(AsrStateContext);

  if (context === undefined) {
    throw new Error('useAsrState 必须在 AsrStateContext Provider 中使用');
  }
  return context;
}

export function useAsrDispatch() {
  const context = React.useContext(AsrDispatchContext);

  if (context === undefined) {
    throw new Error('useAsrDispatch 必须在 AsrDispatchContext Provider中使用');
  }
  return context;
}

// 返回 全局的 context ， 其他地方调用
export function useAuthState() {
  const context = React.useContext(AuthStateContext);

  if (context === undefined) {
    // 判断异常， 必须在包裹中使用
    throw new Error('useAuthState 必须要在 AuthStateContext Provider 中使用');
  }

  return context;
}

export function useAuthDispatch() {
  const context = React.useContext(AuthDispatchContext);

  if (context === undefined) {
    throw new Error(
      'useAuth Dispatch  必须要在 AuthDispatchContext Provider 中使用',
    );
  }

  return context;
}

/*
 * 一个普通通常的组件， 包裹 children
 * 唯一特别的地方是使用了 Context
 * 自此， 所有位于该react tree 上的子组件都能使用到 context 上的值
 */
export const AuthProvider = ({ children }: { children: JSX.Element }) => {
  const [user, dispatch] = useReducer(AuthReducer, initialState);

  return (
    <AuthStateContext.Provider value={user}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
};

/**
 * 创建一个专门包裹 asr page 的 provider
 * 用来全局处理需要的数据 里面有我全局会用到的
 * 方法
 */
export const AsrProvider = ({ children }: { children: JSX.Element }) => {
  const [asrStore, dispatch] = useReducer(AsrReducer, asrInitialState);

  return (
    <AsrStateContext.Provider value={asrStore}>
      <AsrDispatchContext.Provider value={dispatch}>
        {children}
      </AsrDispatchContext.Provider>
    </AsrStateContext.Provider>
  );
};
