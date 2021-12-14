/**
 *  该页面目前就当作登录界面；
 *  不需要注册功能
 */
import React, {useEffect} from 'react'
import {useLocation, useNavigate} from "react-router-dom";
import {AuthContext} from "../App";
import {Form, Input, Button, Checkbox} from 'antd';

import './AuthPage.scss'
import {FundOutlined} from '@ant-design/icons';
import Cookies from 'js-cookie';


const AuthPage = () => {

    const [form] = Form.useForm();

    let userYa:string = Cookies.get('user')||""


    let navigate = useNavigate();
    let location = useLocation();
    let auth = React.useContext(AuthContext)

    let from = location.state?.from?.pathname || "/";

    const handleSubmit = (value: any) => {
        auth.signIn(value, () => {
            navigate(from, {replace: true});
        })

    }

    const onFinish = (values: any) => {
        console.log('Success:', values, form);
        handleSubmit(values)
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    useEffect(() => {
        if(userYa&&userYa!==''){
            navigate('/', {replace: true});
        }
    }, [userYa,navigate])

    return (
        <div className="loginPage">

            <div className="title">
                <FundOutlined/>
                UMP 传输监控
            </div>

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
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AuthPage
