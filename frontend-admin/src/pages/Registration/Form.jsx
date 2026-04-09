/**
 * 报名表单页
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Select, Button, message, Spin } from 'antd';
import { eventApi, registrationApi } from '../../api';
import { phoneValidator, idCardValidator, requiredRule } from '../../utils/validators';
import './Form.css';

const RegistrationForm = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [eventTypes, setEventTypes] = useState([]);

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  const fetchEvent = async () => {
    setLoading(true);
    try {
      const res = await eventApi.detail(eventId);
      const data = res.data || res;
      setEvent(data);
      setEventTypes(data.types || []);
    } catch (error) {
      message.error('获取赛事信息失败');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const checkUnique = async (idCard) => {
    try {
      const res = await registrationApi.checkUnique({ eventId, idCard });
      return res.data?.isUnique ?? res.isUnique ?? true;
    } catch {
      return true;
    }
  };

  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      const isUnique = await checkUnique(values.idCard);
      if (!isUnique) {
        message.error('该身份证号已报名此赛事');
        setSubmitting(false);
        return;
      }
      await registrationApi.create({ ...values, eventId });
      message.success('报名成功！');
      form.resetFields();
    } catch (error) {
      message.error('报名失败');
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
    <div className="registration-page">
      <div
        className="registration-bg"
        style={{ backgroundImage: `url(${event?.image || `https://picsum.photos/1920/1080?random=${eventId}`})` }}
      />
      <div className="registration-content">
        <div className="registration-card fade-in">
          <div className="registration-card-header">
            <h2>{event?.name}</h2>
            <p>填写信息完成报名</p>
          </div>
          <div className="registration-card-body">
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item name="name" label="姓名" rules={[requiredRule('请输入姓名')]}>
                <Input placeholder="请输入真实姓名" maxLength={20} />
              </Form.Item>
              <Form.Item
                name="phone"
                label="手机号"
                rules={[requiredRule('请输入手机号'), { validator: phoneValidator }]}
              >
                <Input placeholder="请输入手机号" maxLength={11} />
              </Form.Item>
              <Form.Item
                name="idCard"
                label="身份证号"
                rules={[requiredRule('请输入身份证号'), { validator: idCardValidator }]}
              >
                <Input placeholder="请输入身份证号" maxLength={18} />
              </Form.Item>
              <Form.Item name="eventType" label="参赛组别" rules={[requiredRule('请选择参赛组别')]}>
                <Select placeholder="请选择参赛组别">
                  {eventTypes.map((type) => (
                    <Select.Option key={type.id} value={type.id}>
                      {type.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item style={{ marginBottom: 0 }}>
                <Button type="primary" htmlType="submit" loading={submitting} block>
                  提交报名
                </Button>
              </Form.Item>
            </Form>

            <div className="registration-tips">
              <h4>报名须知</h4>
              <ul>
                <li>请确保填写信息真实有效</li>
                <li>每人每项赛事仅可报名一次</li>
                <li>报名成功后请保存好相关凭证</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
