import React, {useState} from 'react';
import Cookies from 'js-cookie';
import {BrowserRouter, Routes, Route, useNavigate, Navigate} from "react-router-dom"


import './App.css';
import TransferPage from "./components/TransferPage";
import AuthPage from "./components/AuthPage";

import {loginForm} from './components/dto/login.interface';
import SrtPage from "./components/srt/SrtPage";
import ContentPage from "./pages/layout/ContentPage";
import {AuthProvider, useAuthState} from "./context/context";


import routes, {RouteType} from "./config/routes";
import LoginPage from "./pages/login";
import _ from "lodash";
import {Link} from 'react-router-dom';


export interface AuthContextType {
    user: any;
    signIn: (user: loginForm, callback: VoidFunction) => void;
    signOut: (callback: VoidFunction) => void;
}

export const AuthContext = React.createContext<AuthContextType>(null!);

function App() {
    const userDetail = useAuthState()
    /**
     * 根据用户对象和cookie 来决定是否跳转到对应的地方去
     */
    return (

        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {
                        // TODO: 重新整理这里的逻辑
                        routes.map((route: RouteType) => {
                            // 公开 path 直接可以访问
                            if(!route.isPrivate){
                                return <Route path={route.path}
                                       element={
                                           (() => {
                                               return <route.component/>
                                           })()
                                       }
                                >
                                </Route>
                            }

                            // 非公开 path ， 判断是否具有 token cookie
                            else if(_.isEmpty(userDetail.user) || _.isNull(userDetail.cookie)) {

                                return <Route path={route.path} element={(()=>
                                {
                                    return <Navigate to="/login"/>
                                })()}/>


                            }
                            else{
                                return (<Route path={route.path}
                                               element={
                                                   (() => {
                                                       return <route.component/>
                                                   })()
                                               }
                                    >
                                    </Route>
                                )
                            }

                        })
                    }
                </Routes>
                {/*<Routes>*/}
                {/*    <Route path="/" element={<ContentPage><SrtPage/></ContentPage>}/>*/}
                {/*    <Route path="/srt" element={<ContentPage><SrtPage/></ContentPage>}/>*/}
                {/*    <Route path="/transfer" element={<ContentPage><TransferPage/></ContentPage>}/>*/}
                {/*    <Route path="/login" element={<AuthPage/>}/>*/}
                {/*</Routes>*/}
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
