import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';
import { loginForm } from './components/dto/login.type';
import { AuthProvider } from './context/context';

import routes, { RouteType } from './config/routes';
import DB from './common/indexed-db';

export type AuthContextType = {
  user: any;
  signIn: (user: loginForm, callback: VoidFunction) => void;
  signOut: (callback: VoidFunction) => void;
};

export const AuthContext = React.createContext<AuthContextType>(null!);

function App() {
  const [shuaibi, setShuaibi] = useState(async () => {
    const hello = async () => {
      const db = await DB.createDB('hello', 1, [
        { name: 'bibi', config: { keyPath: '' } },
      ]);
      return db;
    };
    hello().then((db: any) => {});
  });

  useEffect(() => {
    const hello = async () =>
      await DB.createDB('hello', 1, [
        { name: 'bibi', config: { keyPath: '' } },
      ]);
    hello().then();
  }, []);

  console.log('我是打刷币: ', shuaibi);
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {routes.map((route: RouteType) => {
            return (
              <Route
                path={route.path}
                key={route.path}
                element={(() => {
                  return <route.component />;
                })()}
              />
            );
          })}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
