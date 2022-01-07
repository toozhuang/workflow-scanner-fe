/**
 * 一个高阶函数， 传入组件穿出组件， 在这里做一个简单的判断是否登录了的操作
 */

import React, { useState} from 'react'
import {login} from "../api/authentication.api";
import {AuthContext} from '../App';
import Cookies from 'js-cookie'
import { loginForm } from './dto/login.interface';


function AuthProvider({userO, children}: { userO: any, children: JSX.Element }) {

    let [user, setUser] = useState<any>(null);

    const signIn = async (newUser: loginForm, callback: VoidFunction) => {
        const value = await login(newUser);
        // 设定 User 状态
        const token = value.data.data.token;
        const userFromServer = value.data.data.userInfo;
        delete userFromServer.team;
        delete userFromServer.detail;
        userFromServer.ticket = token;
        setUser(userFromServer);
        // Note: Todo: 有一个问题是如果这个string太长了，cookie 存储是失败的
        Cookies.set('user', JSON.stringify(userFromServer));
        Cookies.set('ticket', token);
        // 全局 rolad 的时候可以直接用
        callback();
    }

    const signOut = (callback:VoidFunction)=>{
        Cookies.remove('user')
        callback()
    }



    const value = {user, signIn, signOut}
    if (userO !== '{}') {
        value.user = JSON.parse(userO)
    }


    // useEffect(
    //     () => {
    //         if (userString !== '') {
    //             setUser(JSON.parse(userString))
    //         } else {
    //         }
    //     }, [userString]
    //     //    Note： React Hook useEffect has a missing dependency: 'userString'
    //     // 之前没有在这里添加 userString 到数组的造成了 React Hook 无法利用前后比对来决定是否
    //     // 真的要在这里 render（也就是触发Effect
    //     // 具体的原因见： https://reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects
    //     // 这里又可以引入： https://ithelp.ithome.com.tw/articles/10271802?sc=iThelpR 这个 useCallBack 来记住函数
    // )


    // @ts-ignore
    return (<AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>)
}

export default AuthProvider
