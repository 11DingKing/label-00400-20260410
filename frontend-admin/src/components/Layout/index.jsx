/**
 * 主布局组件
 */
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './index.css';

const Layout = () => {
  return (
    <div className="app-layout">
      <Header />
      <main className="app-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
