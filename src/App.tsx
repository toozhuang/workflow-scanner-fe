import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';
import { loginForm } from './components/dto/login.type';
import { AuthProvider } from './context/context';

import routes, { RouteType } from './config/routes';

import { store } from './redux/store';
import { Provider } from 'react-redux';

export type AuthContextType = {
  user: any;
  signIn: (user: loginForm, callback: VoidFunction) => void;
  signOut: (callback: VoidFunction) => void;
};

export const AuthContext = React.createContext<AuthContextType>(null!);

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
