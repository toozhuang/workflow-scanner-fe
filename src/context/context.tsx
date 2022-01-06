/**
 * 存储当前整个系统中需要的集合数据
 */
import React, {useReducer} from 'react'
import {AuthReducer, initialState} from "./reducer";

const AuthStateContext = React.createContext(initialState);

export function useAuthState(){
    const context = React.useContext(AuthStateContext)

    if(context === undefined){
        // 判断异常， 必须在包裹中使用
        throw new Error('useAuthState 必须要在 AuthProver 中使用')
    }

    return context;
}



/*
* 一个普通通常的组件， 包裹 children
* 唯一特别的地方是使用了 Context
* 自此， 所有位于该react tree 上的子组件都能使用到 context 上的值
 */
export const AuthProvider = ({children}: { children: JSX.Element }) => {
    const [user, dispatch] = useReducer(AuthReducer, initialState);

    console.log('默认 user 这个地方应该是： ', user)

    return (
        <AuthStateContext.Provider value={user}>
            {children}
        </AuthStateContext.Provider>
    )
}
