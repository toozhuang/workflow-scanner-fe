import React from 'react';
import { Button, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { loginOut } from '../../context/action';
import { useAuthDispatch } from '../../context/context';

const SettingPage = () => {
  const navigate = useNavigate();
  const dispatch = useAuthDispatch();

  const logout = () => {
    if (loginOut(dispatch)) {
      navigate('/');
    }
  };

  return (
    <div>
      <Space>
        Space
        <Button type="primary" onClick={logout}>
          Logout
        </Button>
      </Space>
    </div>
  );
};

export default SettingPage;
