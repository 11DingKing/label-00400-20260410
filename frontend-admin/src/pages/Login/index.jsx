/**
 * 登录页 - 现代分屏设计
 */
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, TrophyOutlined } from '@ant-design/icons';
import { useAuth } from '../../store/AuthContext';
import './index.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await login(values);
      message.success('登录成功');
      navigate(from, { replace: true });
    } catch (error) {
      message.error(error.response?.data?.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-brand">
          <div className="logo">
            <TrophyOutlined /> SPORTS
          </div>
          <h1>
            开启你的<br />
            <span>运动之旅</span>
          </h1>
          <p>
            加入我们，与数万名运动爱好者一起，挑战极限，超越自我
          </p>
        </div>
      </div>
      
      <div className="login-right">
        <div className="login-card">
          <div className="login-header">
            <h2>欢迎回来</h2>
            <p>请登录您的账号继续</p>
          </div>
          
          <Form
            className="login-form"
            name="login"
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              name="username"
              label="用户名"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="请输入用户名"
                size="large"
              />
            </Form.Item>
            <Form.Item
              name="password"
              label="密码"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="请输入密码"
                size="large"
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
