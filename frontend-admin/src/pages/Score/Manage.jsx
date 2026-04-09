/**
 * 成绩管理页
 */
import { useState, useEffect } from 'react';
import { Table, Input, Button, Modal, Form, Select, InputNumber, message } from 'antd';
import { SearchOutlined, PlusOutlined, DownloadOutlined, EditOutlined } from '@ant-design/icons';
import { scoreApi, eventApi } from '../../api';
import { exportToExcel } from '../../utils/export';
import { idCardValidator, requiredRule } from '../../utils/validators';
import dayjs from 'dayjs';
import './Manage.css';

const ScoreManage = () => {
  const [data, setData] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
    fetchEvents();
  }, [pagination.current, pagination.pageSize]);

  const fetchData = async (search = keyword) => {
    setLoading(true);
    try {
      const res = await scoreApi.list({
        page: pagination.current,
        pageSize: pagination.pageSize,
        keyword: search,
      });
      const result = res.data || res;
      setData(result.list || []);
      setPagination((prev) => ({ ...prev, total: result.total || 0 }));
    } catch (error) {
      console.error('获取成绩列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await eventApi.list();
      setEvents(res.data || res || []);
    } catch (error) {
      console.error('获取赛事列表失败:', error);
    }
  };

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchData(keyword);
  };

  const handleExport = () => {
    const exportColumns = [
      { title: '身份证号', dataIndex: 'idCard' },
      { title: '姓名', dataIndex: 'name' },
      { title: '赛事名称', dataIndex: 'eventName' },
      { title: '成绩', dataIndex: 'score' },
      { title: '排名', dataIndex: 'rank' },
    ];
    exportToExcel(data, exportColumns, `成绩数据_${dayjs().format('YYYYMMDD')}`);
    message.success('导出成功');
  };

  const openModal = (record = null) => {
    setEditingRecord(record);
    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
    }
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingRecord) {
        await scoreApi.update(editingRecord.id, values);
        message.success('更新成功');
      } else {
        await scoreApi.create(values);
        message.success('录入成功');
      }
      setModalVisible(false);
      fetchData();
    } catch (error) {
      if (error.errorFields) return;
      message.error('操作失败');
    }
  };

  const columns = [
    { title: '身份证号', dataIndex: 'idCard', width: 200 },
    { title: '姓名', dataIndex: 'name', width: 120 },
    { title: '赛事名称', dataIndex: 'eventName', width: 200 },
    { title: '成绩', dataIndex: 'score', width: 120 },
    { 
      title: '排名', 
      dataIndex: 'rank', 
      width: 100,
      render: (rank) => <span style={{ fontWeight: 700, color: 'var(--accent-color)' }}>#{rank}</span>
    },
    {
      title: '操作',
      width: 100,
      render: (_, record) => (
        <Button type="text" icon={<EditOutlined />} onClick={() => openModal(record)}>
          编辑
        </Button>
      ),
    },
  ];

  return (
    <div className="score-manage-page fade-in">
      <div className="page-header">
        <h1>成绩管理</h1>
        <p>录入、编辑和导出选手比赛成绩</p>
      </div>

      <div className="toolbar">
        <div className="search-box">
          <SearchOutlined className="search-icon" />
          <Input
            placeholder="搜索身份证号或姓名..."
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
        <div className="action-btns">
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
            录入成绩
          </Button>
          <Button icon={<DownloadOutlined />} onClick={handleExport}>
            导出
          </Button>
        </div>
      </div>

      <div className="data-card">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          loading={loading}
          scroll={{ x: 800 }}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
            onChange: (page, pageSize) => setPagination({ ...pagination, current: page, pageSize }),
          }}
        />
      </div>

      <Modal
        title={editingRecord ? '编辑成绩' : '录入成绩'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        okText="确定"
        cancelText="取消"
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 24 }}>
          <Form.Item
            name="idCard"
            label="身份证号"
            rules={[requiredRule('请输入身份证号'), { validator: idCardValidator }]}
          >
            <Input placeholder="请输入身份证号" maxLength={18} disabled={!!editingRecord} />
          </Form.Item>
          <Form.Item name="eventId" label="赛事" rules={[requiredRule('请选择赛事')]}>
            <Select placeholder="请选择赛事" disabled={!!editingRecord}>
              {events.map((event) => (
                <Select.Option key={event.id} value={event.id}>
                  {event.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="score" label="成绩" rules={[requiredRule('请输入成绩')]}>
            <Input placeholder="请输入成绩，如 3:45:30" />
          </Form.Item>
          <Form.Item name="rank" label="排名" rules={[requiredRule('请输入排名')]}>
            <InputNumber placeholder="请输入排名" min={1} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ScoreManage;
