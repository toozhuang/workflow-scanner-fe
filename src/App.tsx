import React, {useState} from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom"
import {Layout, Menu, Breadcrumb} from 'antd';
import {
    DesktopOutlined,
    PieChartOutlined,
    FileOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';


import './App.css';
import TransferPage from "./components/TransferPage";
import AuthPage, {loginForm} from "./components/AuthPage";
import RequireAuth from "./components/RequireAuth";
import AuthProvider from "./components/AuthProvider";
import Cookies from 'js-cookie';


const {Header, Content, Footer, Sider} = Layout;
const {SubMenu} = Menu;


export interface AuthContextType {
    user: any;
    signIn: (user: loginForm, callback: VoidFunction) => void;
    signOut: (callback: VoidFunction) => void;
}

export const AuthContext = React.createContext<AuthContextType>(null!);

function App() {

    const [collapsed, onCollapse] = useState(false)

    console.log(process.env)

    const  LoginFragement = ()=> <Layout style={{minHeight: '100vh'}}>
        <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
            <div className="logo"/>
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                <Menu.Item key="1" icon={<PieChartOutlined/>}>
                    Option 1
                </Menu.Item>
                <Menu.Item key="2" icon={<DesktopOutlined/>}>
                    Option 2
                </Menu.Item>
                <SubMenu key="sub1" icon={<UserOutlined/>} title="User">
                    <Menu.Item key="3">Tom</Menu.Item>
                    <Menu.Item key="4">Bill</Menu.Item>
                    <Menu.Item key="5">Alex</Menu.Item>
                </SubMenu>
                <SubMenu key="sub2" icon={<TeamOutlined/>} title="Team">
                    <Menu.Item key="6">Team 1</Menu.Item>
                    <Menu.Item key="8">Team 2</Menu.Item>
                </SubMenu>
                <Menu.Item key="9" icon={<FileOutlined/>}>
                    Files
                </Menu.Item>
            </Menu>
        </Sider>
        <Layout className="site-layout">
            <Content style={{margin: '0 16px'}}>
                <Breadcrumb style={{margin: '16px 0'}}>
                    <Breadcrumb.Item>User</Breadcrumb.Item>
                    <Breadcrumb.Item>Bill</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-background" style={{padding: 24, minHeight: 360}}>
                    <div className="App">
                        <div className='container'>
                            <RequireAuth><TransferPage/></RequireAuth>
                        </div>
                    </div>
                </div>
            </Content>
            <Footer style={{textAlign: 'center'}}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
    </Layout>

    return (
        <AuthProvider userO={Cookies.get('user') || '{}'}>
            <BrowserRouter>
                <Routes>

                    <Route path="/" element={<LoginFragement></LoginFragement>}/>
                    <Route path="/login" element={<AuthPage/>}/>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
