import RequireAuth from '../../components/RequireAuth';
import { Breadcrumb, Layout, Menu } from 'antd';
import React, { useCallback, useState } from 'react';
import { DesktopOutlined, FileOutlined, UserOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router';
import { useNavigate } from 'react-router-dom';

const menus = [
  {
    id: 1,
    name: '字幕服务',
    path: '/asr',
    icon: <FileOutlined />,
  },
  // {
  //   id: 2,
  //   name: '工作流监控',
  //   icon: <DesktopOutlined></DesktopOutlined>,
  // },

  {
    id: 2,
    name: '翻译服务',
    path: '/translate',
    icon: <DesktopOutlined />,
  },
  {
    id: 3,
    name: '系统管理',
    path: '/setting',
    icon: <UserOutlined />,
  },
];

const { Content, Footer, Sider } = Layout;

const ContentPage = ({ children }: { children: JSX.Element }) => {
  const [collapsed, onCollapse] = useState(false);
  const navigate = useNavigate();

  const { pathname: PATH_NAME } = useLocation();

  const name = useCallback(path => {
    return menus.filter(item => item.path === path || path === '/')[0];
  }, []);

  const selectedKey = useCallback(path => {
    return (
      menus.filter(
        item =>
          item.path === path ||
          item.path.split('/')[1] === path.split('/')[1] ||
          path === '/',
      )[0].id + ''
    );
  }, []);

  return (
    <RequireAuth>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
          <div className="logo" />
          <Menu
            theme="dark"
            defaultSelectedKeys={['1']}
            selectedKeys={[selectedKey(PATH_NAME)]}
            mode="inline"
          >
            {menus.map(item => {
              return (
                <Menu.Item
                  key={'' + item.id}
                  icon={item.icon}
                  onClick={() => navigate(`${item.path}`)}
                >
                  {item.name}
                </Menu.Item>
              );
            })}
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Content style={{ margin: '0 16px' }}>
            {/*<Breadcrumb style={{ margin: '16px 0' }}>*/}
            {/*  <Breadcrumb.Item>/{name(PATH_NAME).name}</Breadcrumb.Item>*/}
            {/*</Breadcrumb>*/}
            <div
              className="site-layout-background"
              style={{ padding: 24, minHeight: 360 }}
            >
              <div className="App">
                <div className="container">{children}</div>
              </div>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>PhoenixTV 2022</Footer>
        </Layout>
      </Layout>
    </RequireAuth>
  );
};

export default ContentPage;
