/**
 * 权限工具函数
 */

// 获取当前用户信息
export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// 获取用户权限
export const getPermissions = () => {
  const user = getUser();
  return user?.permissions || [];
};

// 检查是否有某个权限
export const hasPermission = (permission) => {
  const permissions = getPermissions();
  return permissions.includes(permission) || permissions.includes('admin');
};

// 检查是否登录
export const isLoggedIn = () => {
  return !!localStorage.getItem('token');
};

// 登出
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

// 权限常量
export const PERMISSIONS = {
  ARTICLE_PUBLISH: 'article:publish',
  ARTICLE_MANAGE: 'article:manage',
  REGISTRATION_VIEW: 'registration:view',
  REGISTRATION_EXPORT: 'registration:export',
  SCORE_MANAGE: 'score:manage',
  ADMIN: 'admin',
};
