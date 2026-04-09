/**
 * 权限路由组件
 */
import { Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { useAuth } from '../store/AuthContext';

// 需要登录的路由
export const AuthRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// 需要特定权限的路由
export const PermissionRoute = ({ permission, children }) => {
  const { user, loading, hasPermission } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!hasPermission(permission)) {
    return <Navigate to="/403" replace />;
  }

  return children;
};
