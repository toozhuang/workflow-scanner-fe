import React from 'react';
import { Button, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { loginOut } from '../../context/action';
import { useAuthDispatch } from '../../context/context';

const TranslatePage = () => {
  const navigate = useNavigate();
  const dispatch = useAuthDispatch();

  const logout = () => {
    if (loginOut(dispatch)) {
      navigate('/');
    }
  };

  return (
    <div>
      <Space size="large">
        <h3>登出</h3>
        <Button type="primary" onClick={logout}>
          Logout
        </Button>
      </Space>
    </div>
  );
};

export default TranslatePage;
