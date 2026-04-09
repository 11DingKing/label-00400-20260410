/**
 * 文章发布/编辑页
 */
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button, message, Spin } from 'antd';
import RichTextEditor from '../../components/RichTextEditor';
import { articleApi } from '../../api';
import './Publish.css';

const ArticlePublish = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [content, setContent] = useState('');

  const isEdit = !!id;

  useEffect(() => {
    if (isEdit) {
      fetchArticle();
    }
  }, [id]);

  const fetchArticle = async () => {
    setLoading(true);
    try {
      const res = await articleApi.detail(id);
      const data = res.data || res;
      form.setFieldsValue({
        title: data.title,
        author: data.author,
      });
      setContent(data.content || '');
    } catch (error) {
      message.error('获取文章失败');
      navigate('/articles');
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    if (!content.trim() || content === '<p></p>') {
      message.warning('请输入文章内容');
      return;
    }
    setSubmitting(true);
    try {
      const data = { ...values, content };
      if (isEdit) {
        await articleApi.update(id, data);
        message.success('更新成功');
      } else {
        await articleApi.create(data);
        message.success('发布成功');
        form.resetFields();
        setContent('');
      }
      navigate('/articles');
    } catch (error) {
      message.error(isEdit ? '更新失败' : '发布失败');
    } finally {
      setSubmitting(false);
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
    <div className="article-publish-page fade-in">
      <div className="page-header">
        <h1>{isEdit ? '编辑文章' : '发布文章'}</h1>
        <p>{isEdit ? '修改文章内容并更新' : '撰写并发布新的资讯文章'}</p>
      </div>

      <div className="publish-card">
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="title"
            label="文章标题"
            rules={[{ required: true, message: '请输入文章标题' }]}
          >
            <Input placeholder="请输入一个吸引人的标题" maxLength={100} />
          </Form.Item>
          <Form.Item
            name="author"
            label="作者"
            rules={[{ required: true, message: '请输入作者' }]}
          >
            <Input placeholder="请输入作者名称" maxLength={50} />
          </Form.Item>
          <div className="editor-wrapper">
            <div className="editor-label">文章内容</div>
            <RichTextEditor value={content} onChange={setContent} />
          </div>
          <div className="form-actions">
            <Button type="primary" htmlType="submit" loading={submitting}>
              {isEdit ? '更新文章' : '发布文章'}
            </Button>
            <Button onClick={() => navigate('/articles')}>
              取消
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ArticlePublish;
