import React from 'react'

import LoginPage from '../pages/login'
import AsrPage from "../pages/asr";


export type RouteType ={
    path: string,
    component: ()=>JSX.Element,
    isPrivate: boolean
}

const routes:RouteType[] = [

    {
        path:'/',
        component: AsrPage,
        isPrivate: true
    },
    {
        path:'/login',
        component: LoginPage,
        isPrivate: false
    },
    {
        path:'/asr',
        component: AsrPage,
        isPrivate: true
    }

]

export default routes
