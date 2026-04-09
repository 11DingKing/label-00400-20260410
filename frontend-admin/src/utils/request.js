/**
 * Axios 请求封装
 */
import axios from 'axios';
import { message } from 'antd';
import { mockAdapter } from '../mock';

const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// 使用 Mock 适配器（无后端服务时）
request.defaults.adapter = mockAdapter;

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 处理 params，拼接到 URL（Mock 适配器需要）
    if (config.params && Object.keys(config.params).length > 0) {
      const params = new URLSearchParams();
      Object.entries(config.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value);
        }
      });
      const separator = config.url.includes('?') ? '&' : '?';
      config.url = config.url + separator + params.toString();
    }
    
    // 序列化 data
    if (config.data && typeof config.data === 'object') {
      config.data = JSON.stringify(config.data);
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const { response } = error;
    if (response) {
      switch (response.status) {
        case 401:
          message.error('登录已过期，请重新登录');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
        case 403:
          message.error('权限不足');
          break;
        case 404:
          message.error('请求资源不存在');
          break;
        case 500:
          message.error('服务器错误');
          break;
        default:
          message.error(response.data?.message || '请求失败');
      }
    } else {
      message.error('网络连接失败');
    }
    return Promise.reject(error);
  }
);

export default request;
