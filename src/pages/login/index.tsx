/**
 *  该页面目前就当作登录界面；
 *  不需要注册功能
 *  Note: 有考虑是否这部分可以抽离成一个独立的hook
 *  但细想以后，感觉不需要
 */
import React from 'react'
import {Navigate, useLocation, useNavigate} from "react-router-dom";
import {Form, Input, Button, Checkbox, message} from 'antd';

import './login.scss'
import {FundOutlined} from '@ant-design/icons';

import {loginForm} from "../../components/dto/login.type";
import {useAuthDispatch, useAuthState} from "../../context/context";
import {loginUser} from "../../context/action";
import _ from "lodash";


const LoginPage = () => {

    const userDetail = useAuthState()

    let navigate = useNavigate();
    let location = useLocation();
    let auth = useAuthDispatch();

    const onFinish = async (value: loginForm) => {

        try {
            await loginUser(auth, value)
            navigate('/asr', {replace: true})
        } catch  {

        }


    };

    const onFinishFailed = () => {
        message.error("请按照提示修改错误")
    };


    // 下面的两种跳转逻辑都 OK
    if (!(_.isEmpty(userDetail.user))) {
        // navigate('/', {replace: true});
        return <Navigate to="/" state={{from: location}}/>;

    }


    return (

        <div className="App">
            <div className='container'>
                <div className="
        loginPage">

                    <div className="title">
                        <FundOutlined/>
                        {/* TODO： 后期支持语言内部文字化*/}
                        Phoenix TV Web Tools
                    </div>

                    {/* 看起来 react ant design 的 form 默认有 event prevent default 的方法
                提交事件以后， 并不会刷新页面
            */}
                    <Form
                        name="basic"
                        className="loginForm"
                        labelCol={{span: 4}}
                        wrapperCol={{span: 20}}
                        initialValues={{remember: true}}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="邮箱"
                            name="email"
                            rules={[
                                {type: 'email', message: '请输入正确的邮箱格式!'},
                                {required: true, message: '请输入你的邮箱!'}]}
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            label="密码"
                            name="password"
                            rules={[{required: true, message: '请输入你的密码!'}]}
                        >
                            <Input.Password/>
                        </Form.Item>

                        <Form.Item name="remember" valuePropName="checked" wrapperCol={{offset: 0, span: 24}}>
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>

                        <Form.Item wrapperCol={{offset: 0, span: 24}}>
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

export default LoginPage
