import React from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom"

import './App.css';
import TransferPage from "./components/TransferPage";
import AuthPage from "./components/AuthPage";
import RequireAuth from "./components/RequireAuth";
import AuthProvider from "./components/AuthProvider";
import Cookies from 'js-cookie';

export interface AuthContextType {
    user: any;
    signIn: (user: string, callback: VoidFunction) => void;
    signOut: (callback: VoidFunction) => void;
}

export const AuthContext = React.createContext<AuthContextType>(null!);

function App() {

    return (
        <AuthProvider userO={Cookies.get('user')||'{}'}>
            <div className="App">
                <div className='container'>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<RequireAuth><TransferPage/></RequireAuth>}/>
                            <Route path="/login" element={<AuthPage/>}/>
                        </Routes>
                    </BrowserRouter>
                </div>
            </div>
        </AuthProvider>
    );
}

export default App;
