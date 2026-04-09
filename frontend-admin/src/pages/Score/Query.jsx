/**
 * 成绩查询页
 */
import { useState } from 'react';
import { Card, Form, Input, Button, Empty, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { scoreApi } from '../../api';
import { idCardValidator, requiredRule } from '../../utils/validators';
import './Query.css';

const ScoreQuery = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [scores, setScores] = useState(null);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await scoreApi.query(values.idCard);
      const data = res.data || res;
      setScores(data.list || data || []);
      if (!data.list?.length && !data?.length) {
        message.info('未查询到成绩');
      }
    } catch (error) {
      message.error('查询失败');
      setScores([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="score-query-page fade-in">
      <div className="query-header">
        <h1>成绩查询</h1>
        <p>输入身份证号，查看您的所有参赛成绩</p>
      </div>

      <Card className="query-card">
        <Form form={form} className="query-form" onFinish={onFinish}>
          <Form.Item
            name="idCard"
            rules={[requiredRule('请输入身份证号'), { validator: idCardValidator }]}
          >
            <Input placeholder="请输入身份证号" maxLength={18} />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<SearchOutlined />}
              block
            >
              查询成绩
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {scores !== null && (
        <div className="result-section">
          <div className="result-header">
            <h3>查询结果</h3>
            <span className="result-count">共 {scores.length} 条记录</span>
          </div>
          
          {scores.length > 0 ? (
            scores.map((item, index) => (
              <div key={index} className="score-card">
                <div className="score-card-header">
                  <div>
                    <div className="score-event">{item.eventName}</div>
                    <div className="score-type">{item.eventTypeName}</div>
                  </div>
                  <div className="score-rank-badge">第 {item.rank} 名</div>
                </div>
                <div className="score-stats">
                  <div className="score-stat">
                    <div className="score-stat-label">完赛成绩</div>
                    <div className="score-stat-value">{item.score}</div>
                  </div>
                  <div className="score-stat">
                    <div className="score-stat-label">总排名</div>
                    <div className="score-stat-value rank">#{item.rank}</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <Empty description="暂无成绩记录" style={{ padding: 60 }} />
          )}
        </div>
      )}
    </div>
  );
};

export default ScoreQuery;
