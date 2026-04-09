/**
 * 首页 - 顶级赛事网站风格
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Spin, Empty } from 'antd';
import { TrophyOutlined, SearchOutlined, RightOutlined, CalendarOutlined } from '@ant-design/icons';
import { eventApi, articleApi } from '../../api';
import './index.css';

const Home = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [eventsRes, articlesRes] = await Promise.all([
        eventApi.list(),
        articleApi.list({ page: 1, pageSize: 4 }),
      ]);
      // 处理 events 数据
      const eventsData = eventsRes?.data || eventsRes;
      setEvents(Array.isArray(eventsData) ? eventsData : []);
      // 处理 articles 数据
      const articlesData = articlesRes?.data || articlesRes;
      setArticles(Array.isArray(articlesData?.list) ? articlesData.list : (Array.isArray(articlesData) ? articlesData : []));
    } catch (error) {
      console.error('获取数据失败:', error);
      setEvents([]);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Hero 区域 */}
      <section className="hero-section">
        <div className="hero-content fade-in">
          <div className="hero-badge">
            <span className="dot" />
            2026 赛季报名进行中
          </div>
          <h1>
            挑战极限<br />
            <span>超越自我</span>
          </h1>
          <p>
            加入数万名运动爱好者，参与顶级赛事，记录每一次突破
          </p>
          <div className="hero-buttons">
            <Button type="primary" icon={<TrophyOutlined />} onClick={() => navigate('/registration/1')}>
              立即报名
            </Button>
            <Button className="btn-secondary" icon={<SearchOutlined />} onClick={() => navigate('/score-query')}>
              查询成绩
            </Button>
          </div>
        </div>
      </section>

      {/* 统计数据 */}
      <section className="stats-section">
        <div className="stat-card">
          <div className="stat-number">50K+</div>
          <div className="stat-label">注册选手</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">120+</div>
          <div className="stat-label">赛事场次</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">30+</div>
          <div className="stat-label">合作城市</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">98%</div>
          <div className="stat-label">好评率</div>
        </div>
      </section>

      {/* 热门赛事 */}
      <section className="events-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">热门赛事</h2>
            <p className="section-subtitle">精选优质赛事，等你来挑战</p>
          </div>
          <a className="section-link" onClick={() => navigate('/articles')}>
            查看全部 <RightOutlined />
          </a>
        </div>
        
        {events.length > 0 ? (
          <div className="events-grid">
            {events.map((event, index) => (
              <div key={event.id} className="event-card" onClick={() => navigate(`/registration/${event.id}`)}>
                <div className="event-image-wrapper">
                  <div
                    className="event-image"
                    style={{ backgroundImage: `url(${event.image || `https://picsum.photos/600/400?random=${event.id}`})` }}
                  />
                  <div className="event-overlay" />
                  {index === 0 && <span className="event-badge">热门</span>}
                </div>
                <div className="event-content">
                  <h3>{event.name}</h3>
                  <p>{event.description}</p>
                  <div className="event-footer">
                    <span className="event-date">
                      <CalendarOutlined /> 2026年3月
                    </span>
                    <Button type="primary" className="event-btn">
                      立即报名
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Empty description="暂无赛事" />
        )}
      </section>

      {/* 精选文章 */}
      <section className="articles-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">精选资讯</h2>
            <p className="section-subtitle">赛事动态、训练技巧、选手故事</p>
          </div>
          <a className="section-link" onClick={() => navigate('/articles')}>
            查看全部 <RightOutlined />
          </a>
        </div>

        {articles.length > 0 ? (
          <div className="articles-grid">
            {articles.map((article, index) => (
              <div
                key={article.id}
                className="article-card"
                onClick={() => navigate(`/article/${article.id}`)}
              >
                <div
                  className="article-image"
                  style={{ backgroundImage: `url(https://picsum.photos/400/300?random=${article.id + 10})` }}
                />
                <div className="article-body">
                  <span className="article-tag">资讯</span>
                  <h4 className="article-title">{article.title}</h4>
                  <div className="article-meta">
                    <span>{article.author}</span>
                    <span>{article.createdAt?.split(' ')[0]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Empty description="暂无文章" />
        )}
      </section>

      {/* CTA 区域 */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>准备好开始你的挑战了吗？</h2>
          <p>输入身份证号，即可快速查询所有参赛成绩和排名</p>
          <Button icon={<SearchOutlined />} onClick={() => navigate('/score-query')}>
            查询我的成绩
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
