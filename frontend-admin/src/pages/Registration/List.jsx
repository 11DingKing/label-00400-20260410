/**
 * 报名列表页
 */
import { useState, useEffect } from 'react';
import { Table, Input, Button, message } from 'antd';
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import { registrationApi } from '../../api';
import { exportToExcel } from '../../utils/export';
import dayjs from 'dayjs';
import './List.css';

const RegistrationList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize]);

  const fetchData = async (search = keyword) => {
    setLoading(true);
    try {
      const res = await registrationApi.list({
        page: pagination.current,
        pageSize: pagination.pageSize,
        keyword: search,
      });
      const result = res.data || res;
      setData(result.list || []);
      setPagination((prev) => ({ ...prev, total: result.total || 0 }));
    } catch (error) {
      console.error('获取报名列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchData(keyword);
  };

  const handleExport = () => {
    const exportColumns = [
      { title: '姓名', dataIndex: 'name' },
      { title: '手机号', dataIndex: 'phone' },
      { title: '身份证号', dataIndex: 'idCard' },
      { title: '赛事名称', dataIndex: 'eventName' },
      { title: '赛事类型', dataIndex: 'eventTypeName' },
      { title: '报名时间', dataIndex: 'createdAt' },
    ];
    exportToExcel(data, exportColumns, `报名数据_${dayjs().format('YYYYMMDD')}`);
    message.success('导出成功');
  };

  const columns = [
    { title: '姓名', dataIndex: 'name', width: 100 },
    { title: '手机号', dataIndex: 'phone', width: 140 },
    { title: '身份证号', dataIndex: 'idCard', width: 200 },
    { title: '赛事名称', dataIndex: 'eventName', width: 200 },
    { 
      title: '参赛组别', 
      dataIndex: 'eventTypeName', 
      width: 140,
      render: (text) => (
        <span style={{ 
          background: 'var(--primary-light)', 
          color: 'var(--primary-color)',
          padding: '4px 12px',
          borderRadius: 'var(--radius-full)',
          fontSize: 13,
          fontWeight: 600
        }}>
          {text}
        </span>
      )
    },
    {
      title: '报名时间',
      dataIndex: 'createdAt',
      width: 180,
      render: (text) => dayjs(text).format('YYYY-MM-DD HH:mm'),
    },
  ];

  return (
    <div className="registration-list-page fade-in">
      <div className="page-header">
        <h1>报名管理</h1>
        <p>查看和导出所有赛事报名信息</p>
      </div>

      <div className="toolbar">
        <div className="search-box">
          <SearchOutlined className="search-icon" />
          <Input
            placeholder="搜索姓名或身份证号..."
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
        <Button icon={<DownloadOutlined />} className="export-btn" onClick={handleExport}>
          导出 Excel
        </Button>
      </div>

      <div className="data-card">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          loading={loading}
          scroll={{ x: 1000 }}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
            onChange: (page, pageSize) => setPagination({ ...pagination, current: page, pageSize }),
          }}
        />
      </div>
    </div>
  );
};

export default RegistrationList;
