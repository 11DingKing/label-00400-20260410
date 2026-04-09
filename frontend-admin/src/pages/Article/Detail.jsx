/**
 * 文章详情页
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, message, Avatar } from 'antd';
import { ArrowLeftOutlined, CalendarOutlined } from '@ant-design/icons';
import { articleApi } from '../../api';
import dayjs from 'dayjs';
import './Detail.css';

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    setLoading(true);
    try {
      const res = await articleApi.detail(id);
      setArticle(res.data || res);
    } catch (error) {
      message.error('获取文章失败');
      navigate('/articles');
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

  if (!article) {
    return null;
  }

  return (
    <div className="article-detail-page fade-in">
      <button className="back-btn" onClick={() => navigate('/articles')}>
        <ArrowLeftOutlined /> 返回列表
      </button>

      <div
        className="article-cover"
        style={{ backgroundImage: `url(https://picsum.photos/1200/600?random=${id})` }}
      />

      <div className="article-header">
        <span className="article-tag">资讯</span>
        <h1 className="article-title">{article.title}</h1>
        <div className="article-meta">
          <div className="author">
            <Avatar 
              size={44} 
              className="author-avatar"
              style={{ 
                background: 'linear-gradient(135deg, #0066ff 0%, #00c6ff 100%)',
                fontSize: '18px',
                fontWeight: 700,
              }}
            >
              {article.author ? article.author.charAt(0) : '?'}
            </Avatar>
            <div className="author-info">
              <span className="author-name">{article.author || '未知作者'}</span>
              <span className="author-role">作者</span>
            </div>
          </div>
          <div className="date">
            <CalendarOutlined style={{ marginRight: 6 }} />
            {dayjs(article.createdAt).format('YYYY年MM月DD日')}
          </div>
        </div>
      </div>

      <div
        className="article-content"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </div>
  );
};

export default ArticleDetail;
