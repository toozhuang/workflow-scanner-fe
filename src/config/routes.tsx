import React from 'react'

import LoginPage from '../pages/login'
import AsrPage from "../pages/asr";
import RequireAuth from "../components/RequireAuth";
import ContentPage from "../pages/layout/ContentPage";
import {AsrProvider} from "../context/context";


export type RouteType = {
    path: string,
    component: () => JSX.Element,
    isPrivate: boolean
}

const routes: RouteType[] = [
    {
        path: '/login',
        component: () => <LoginPage/>,
        isPrivate: false
    },
    {
        path: '/',
        component: () => <RequireAuth>
            <ContentPage>
                <AsrPage></AsrPage>
            </ContentPage>
        </RequireAuth>,
        isPrivate: true
    },
    {
        path: '/asr',
        component: () => <RequireAuth>
            <ContentPage>
                <AsrProvider>
                    <AsrPage></AsrPage>
                </AsrProvider>
            </ContentPage>
        </RequireAuth>,
        isPrivate: true
    },


]

export default routes
