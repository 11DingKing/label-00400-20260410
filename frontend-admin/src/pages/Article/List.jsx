/**
 * 文章列表页 - 卡片式布局
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Pagination, Popconfirm, message, Avatar } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, FileTextOutlined } from '@ant-design/icons';
import { articleApi } from '../../api';
import { useAuth } from '../../store/AuthContext';
import { PERMISSIONS } from '../../utils/auth';
import dayjs from 'dayjs';
import './List.css';

const ArticleList = () => {
  const navigate = useNavigate();
  const { user, hasPermission } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 9, total: 0 });

  useEffect(() => {
    fetchArticles();
  }, [pagination.current, pagination.pageSize]);

  const fetchArticles = async (search = keyword) => {
    setLoading(true);
    try {
      const res = await articleApi.list({
        page: pagination.current,
        pageSize: pagination.pageSize,
        keyword: search,
      });
      const data = res.data || res;
      setArticles(data.list || []);
      setPagination((prev) => ({ ...prev, total: data.total || 0 }));
    } catch (error) {
      console.error('获取文章失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchArticles(keyword);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await articleApi.delete(id);
      message.success('删除成功');
      fetchArticles();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const canEdit = (article) => {
    return hasPermission(PERMISSIONS.ADMIN) || article.authorId === user?.id;
  };

  return (
    <div className="article-list-page fade-in">
      <div className="page-header">
        <h1>资讯中心</h1>
        <p>赛事动态、训练技巧、选手故事，精彩内容尽在这里</p>
      </div>

      <div className="toolbar">
        <div className="search-box">
          <SearchOutlined className="search-icon" />
          <Input
            placeholder="搜索文章..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onPressEnter={handleSearch}
          />
          <Button
            type="primary"
            icon={<SearchOutlined />}
            className="search-btn"
            onClick={handleSearch}
          />
        </div>
        {hasPermission(PERMISSIONS.ARTICLE_PUBLISH) && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="publish-btn"
            onClick={() => navigate('/article/publish')}
          >
            发布文章
          </Button>
        )}
      </div>

      {articles.length > 0 ? (
        <>
          <div className="articles-grid">
            {articles.map((article, index) => (
              <div
                key={article.id}
                className="article-card"
                onClick={() => navigate(`/article/${article.id}`)}
              >
                <div className="article-card-image-wrapper">
                  <div
                    className="article-card-image"
                    style={{ backgroundImage: `url(https://picsum.photos/600/400?random=${article.id + 20})` }}
                  />
                  <span className="article-card-tag">资讯</span>
                </div>
                <div className="article-card-body">
                  <h3 className="article-card-title">{article.title}</h3>
                  <p className="article-card-summary">{article.summary || '暂无简介'}</p>
                  <div className="article-card-footer">
                    <div className="article-card-meta">
                      <span className="article-card-author">
                        <Avatar size={28}>{article.author?.[0]}</Avatar>
                        {article.author}
                      </span>
                      <span className="article-card-date">{dayjs(article.createdAt).format('MM月DD日')}</span>
                    </div>
                    {canEdit(article) && (
                      <div className="article-card-actions" onClick={(e) => e.stopPropagation()}>
                        <Button
                          type="text"
                          size="small"
                          icon={<EditOutlined />}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/article/edit/${article.id}`);
                          }}
                        />
                        <Popconfirm
                          title="确定删除这篇文章？"
                          onConfirm={(e) => handleDelete(e, article.id)}
                          onCancel={(e) => e.stopPropagation()}
                        >
                          <Button type="text" size="small" danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {pagination.total > pagination.pageSize && (
            <div className="pagination-wrapper">
              <Pagination
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={pagination.total}
                showSizeChanger={false}
                onChange={(page) => setPagination((prev) => ({ ...prev, current: page }))}
              />
            </div>
          )}
        </>
      ) : (
        <div className="empty-state">
          <FileTextOutlined />
          <h3>暂无文章</h3>
          <p>还没有发布任何文章</p>
        </div>
      )}
    </div>
  );
};

export default ArticleList;
