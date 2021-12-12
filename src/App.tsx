import React from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom"

import './App.css';
import TransferPage from "./components/TransferPage";
import AuthPage from "./components/AuthPage";
import RequireAuth from "./components/RequireAuth";

export interface AuthContextType {
    user: any;
    signIn?: (user: string, callback: VoidFunction) => void;
    signOut?: (callback: VoidFunction) => void;
}

export const AuthContext = React.createContext<AuthContextType>(null!);

function App() {


    let [user, setUser] = React.useState<any>(null);

    // 暂时先禁用这个登录
    // let signin = (newUser: string, callback: VoidFunction) => {
    //     return fakeAuthProvider.signin(() => {
    //         setUser(newUser);
    //         callback();
    //     });
    // };
    //
    // let signout = (callback: VoidFunction) => {
    //     return fakeAuthProvider.signout(() => {
    //         setUser(null);
    //         callback();
    //     });
    // };

    let value = { user }; // , signin, signout

    return (
        <AuthContext.Provider value={value}>
            <div className="App">
                <div className='container'>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<RequireAuth><TransferPage/></RequireAuth>}/>
                            <Route path="/login" element={<AuthPage/>}/>
                        </Routes>
                    </BrowserRouter>
                </div>
                {/*<div>*/}
                {/*    <TransferPage/>*/}
                {/*</div>*/}
            </div>
        </AuthContext.Provider>
    );
}

export default App;
