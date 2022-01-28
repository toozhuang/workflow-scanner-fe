import React from 'react';

import LoginPage from '../pages/login';
import AsrPage from '../pages/asr';
import RequireAuth from '../components/RequireAuth';
import ContentPage from '../pages/layout/ContentPage';
import { AsrProvider } from '../context/context';
import SettingPage from '../pages/setting';

export type RouteType = {
  path: string;
  component: () => JSX.Element;
  isPrivate: boolean;
};

const routes: RouteType[] = [
  {
    path: '/login',
    component: () => <LoginPage />,
    isPrivate: false,
  },
  {
    path: '/',
    component: () => (
      <RequireAuth>
        <ContentPage>
          <AsrProvider>
            <AsrPage />
          </AsrProvider>
        </ContentPage>
      </RequireAuth>
    ),
    isPrivate: true,
  },
  {
    path: '/asr',
    component: () => (
      <RequireAuth>
        <ContentPage>
          <AsrProvider>
            <AsrPage />
          </AsrProvider>
        </ContentPage>
      </RequireAuth>
    ),
    isPrivate: true,
  },
  {
    path: '/setting',
    component: () => (
      <RequireAuth>
        <ContentPage>
          <SettingPage />
        </ContentPage>
      </RequireAuth>
    ),
    isPrivate: true,
  },
];

export default routes;
