/**
 * 页脚组件
 */
import { TrophyOutlined } from '@ant-design/icons';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <TrophyOutlined /> SPORTS
        </div>
        <div className="footer-info">
          <p>联系我们：contact@sports.com</p>
          <p>服务热线：400-888-8888</p>
        </div>
      </div>
      <div className="footer-bottom">
        © 2026 赛事管理系统 · 让运动更精彩
      </div>
    </footer>
  );
};

export default Footer;
