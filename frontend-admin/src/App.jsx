/**
 * 应用入口组件
 */
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { AuthProvider } from './store/AuthContext';
import router from './router';

// 自定义主题
const theme = {
  token: {
    colorPrimary: '#0066ff',
    colorLink: '#0066ff',
    colorLinkHover: '#0052cc',
    borderRadius: 12,
    colorBgContainer: '#ffffff',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'PingFang SC', 'Microsoft YaHei', sans-serif",
  },
};

const App = () => {
  return (
    <ConfigProvider locale={zhCN} theme={theme}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ConfigProvider>
  );
};

export default App;
