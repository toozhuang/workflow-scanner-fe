/**
 *  该页面目前就当作登录界面；
 *  不需要注册功能
 *  Note: 有考虑是否这部分可以抽离成一个独立的hook
 *  但细想以后，感觉不需要
 */
import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { Form, Input, Button, Checkbox } from 'antd';

import './AuthPage.scss';
import { FundOutlined } from '@ant-design/icons';
import AuthHook from '../common/AuthHook';
import { loginForm } from './dto/login.type';

const AuthPage = () => {
  const [{ isError, isLoading }] = AuthHook();

  const navigate = useNavigate();
  const location = useLocation();
  const auth = React.useContext(AuthContext);

  const from = location.state?.from?.pathname || '/';

  const onFinish = (value: loginForm) => {
    // setLoading(true)
    auth.signIn(value, () => {
      // setLoading(false)
      navigate('/', { replace: true });
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  // 下面的两种跳转逻辑都 OK
  if (!isError && !isLoading) {
    // navigate('/', {replace: true});
    return <Navigate to="/" state={{ from: location }} />;
  }

  return (
    <div className="App">
      <div className="container">
        <div
          className="
        loginPage"
        >
          <div className="title">
            <FundOutlined />
            {/* TODO： 后期支持语言内部文字化*/}
            Phoenix TV Web Tools
          </div>

          {/* 看起来 react ant design 的 form 默认有 event prevent default 的方法
                提交事件以后， 并不会刷新页面
            */}
          <Form
            name="basic"
            className="loginForm"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="邮箱"
              name="email"
              rules={[
                { type: 'email', message: '请输入正确的邮箱格式!' },
                { required: true, message: '请输入你的邮箱!' },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="密码"
              name="password"
              rules={[{ required: true, message: '请输入你的密码!' }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="remember"
              valuePropName="checked"
              wrapperCol={{ offset: 0, span: 24 }}
            >
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 0, span: 24 }}>
              {/*loading={loading}*/}
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
