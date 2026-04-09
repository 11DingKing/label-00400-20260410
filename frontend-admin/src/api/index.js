/**
 * API 接口统一管理
 */
import request from '../utils/request';

// 用户相关
export const userApi = {
  login: (data) => request.post('/user/login', data),
  getPermission: () => request.get('/user/permission'),
  logout: () => request.post('/user/logout'),
};

// 文章相关
export const articleApi = {
  list: (params) => request.get('/articles', { params }),
  detail: (id) => request.get(`/articles/${id}`),
  create: (data) => request.post('/articles', data),
  update: (id, data) => request.put(`/articles/${id}`, data),
  delete: (id) => request.delete(`/articles/${id}`),
};

// 赛事相关
export const eventApi = {
  list: () => request.get('/events'),
  detail: (id) => request.get(`/events/${id}`),
};

// 报名相关
export const registrationApi = {
  list: (params) => request.get('/registrations', { params }),
  create: (data) => request.post('/registrations', data),
  checkUnique: (data) => request.post('/registrations/check', data),
  export: (params) => request.get('/registrations/export', { params, responseType: 'blob' }),
};

// 成绩相关
export const scoreApi = {
  query: (idCard) => request.get('/scores/query', { params: { idCard } }),
  list: (params) => request.get('/scores', { params }),
  create: (data) => request.post('/scores', data),
  update: (id, data) => request.put(`/scores/${id}`, data),
  export: (params) => request.get('/scores/export', { params, responseType: 'blob' }),
};
