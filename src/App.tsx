import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';
import { loginForm } from './components/dto/login.type';
import { AuthProvider } from './context/context';

import routes, { RouteType } from './config/routes';

import { store } from './redux/store';
import { Provider } from 'react-redux';

export type AuthContextType = {
  // user: {}; note： 之前为了安全添加了这些， 但如果在公司内部运行，则不需要这个了
  signIn: (user: loginForm, callback: VoidFunction) => void;
  signOut: (callback: VoidFunction) => void;
};

export const AuthContext = React.createContext<AuthContextType>(
  {} as AuthContextType,
);

function App() {
  return (
    <Provider store={store}>
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
    </Provider>
  );
}

export default App;
