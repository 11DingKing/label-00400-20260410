/**
 * 顶部导航栏组件
 */
import { Menu, Button, Dropdown, Space, Avatar } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  FileTextOutlined,
  TrophyOutlined,
  SearchOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../store/AuthContext';
import { PERMISSIONS } from '../../utils/auth';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, hasPermission } = useAuth();

  const menuItems = [
    { key: '/', icon: <HomeOutlined />, label: '首页' },
    { key: '/articles', icon: <FileTextOutlined />, label: '资讯' },
    { key: '/score-query', icon: <SearchOutlined />, label: '成绩查询' },
  ];

  if (hasPermission(PERMISSIONS.ARTICLE_PUBLISH)) {
    menuItems.push({ key: '/article/publish', icon: <FileTextOutlined />, label: '发布文章' });
  }
  if (hasPermission(PERMISSIONS.REGISTRATION_VIEW)) {
    menuItems.push({ key: '/registrations', icon: <TrophyOutlined />, label: '报名管理' });
  }
  if (hasPermission(PERMISSIONS.SCORE_MANAGE)) {
    menuItems.push({ key: '/score-manage', icon: <TrophyOutlined />, label: '成绩管理' });
  }

  const userMenuItems = [
    { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', onClick: () => { logout(); navigate('/'); } },
  ];

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo" onClick={() => navigate('/')}>
          <TrophyOutlined /> SPORTS
        </div>
        <Menu
          className="nav-menu"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
        <div className="header-right">
          {user ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space className="user-info">
                <Avatar size={32}>{user.username?.[0]?.toUpperCase()}</Avatar>
                <span className="username">{user.username}</span>
              </Space>
            </Dropdown>
          ) : (
            <Button type="primary" className="login-btn" onClick={() => navigate('/login')}>
              登录
            </Button>
          )}
        </div>
        <Dropdown
          className="mobile-menu"
          menu={{ items: menuItems, onClick: ({ key }) => navigate(key) }}
          trigger={['click']}
        >
          <Button icon={<MenuOutlined />} />
        </Dropdown>
      </div>
    </header>
  );
};

export default Header;
