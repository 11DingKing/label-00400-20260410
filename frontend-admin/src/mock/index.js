/**
 * Mock 适配器
 */
import { users, events, articles, registrations, scores } from './data';

// 延迟函数
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// Mock 处理器
const handlers = {
  // 登录
  'POST /user/login': async (data) => {
    const user = users.find((u) => u.username === data.username && u.password === data.password);
    if (user) {
      return { token: 'mock-token-' + user.id, user: { id: user.id, username: user.username, permissions: user.permissions } };
    }
    throw { response: { status: 401, data: { message: '用户名或密码错误' } } };
  },

  // 获取权限
  'GET /user/permission': async (_, config) => {
    const token = config.headers?.Authorization?.replace('Bearer ', '');
    const userId = token?.split('-')[2];
    const user = users.find((u) => u.id === Number(userId));
    if (user) {
      return { id: user.id, username: user.username, permissions: user.permissions };
    }
    throw { response: { status: 401, data: { message: '未登录' } } };
  },

  // 登出
  'POST /user/logout': async () => {
    return { success: true };
  },

  // 赛事列表
  'GET /events': async () => events,

  // 赛事详情
  'GET /events/:id': async (_, config) => {
    const id = config.url.match(/\/events\/(\d+)/)?.[1];
    const event = events.find((e) => e.id === Number(id));
    if (event) return event;
    throw { response: { status: 404, data: { message: '赛事不存在' } } };
  },

  // 文章列表
  'GET /articles': async (_, config) => {
    const params = new URLSearchParams(config.url.split('?')[1]);
    const page = Number(params.get('page')) || 1;
    const pageSize = Number(params.get('pageSize')) || 10;
    const keyword = params.get('keyword') || '';
    let filtered = articles;
    if (keyword) {
      filtered = articles.filter((a) => a.title.includes(keyword));
    }
    const start = (page - 1) * pageSize;
    return { list: filtered.slice(start, start + pageSize), total: filtered.length };
  },

  // 文章详情
  'GET /articles/:id': async (_, config) => {
    const id = config.url.match(/\/articles\/(\d+)/)?.[1];
    const article = articles.find((a) => a.id === Number(id));
    if (article) return article;
    throw { response: { status: 404, data: { message: '文章不存在' } } };
  },

  // 创建文章
  'POST /articles': async (data) => {
    const newArticle = { id: articles.length + 1, ...data, authorId: 1, createdAt: new Date().toISOString() };
    articles.unshift(newArticle);
    return newArticle;
  },

  // 更新文章
  'PUT /articles/:id': async (data, config) => {
    const id = config.url.match(/\/articles\/(\d+)/)?.[1];
    const index = articles.findIndex((a) => a.id === Number(id));
    if (index > -1) {
      articles[index] = { ...articles[index], ...data };
      return articles[index];
    }
    throw { response: { status: 404, data: { message: '文章不存在' } } };
  },

  // 删除文章
  'DELETE /articles/:id': async (_, config) => {
    const id = config.url.match(/\/articles\/(\d+)/)?.[1];
    const index = articles.findIndex((a) => a.id === Number(id));
    if (index > -1) {
      articles.splice(index, 1);
    }
    return { success: true };
  },

  // 报名列表
  'GET /registrations': async (_, config) => {
    const params = new URLSearchParams(config.url.split('?')[1]);
    const page = Number(params.get('page')) || 1;
    const pageSize = Number(params.get('pageSize')) || 10;
    const keyword = params.get('keyword') || '';
    let filtered = registrations;
    if (keyword) {
      filtered = registrations.filter((r) => r.name.includes(keyword) || r.idCard.includes(keyword));
    }
    const start = (page - 1) * pageSize;
    return { list: filtered.slice(start, start + pageSize), total: filtered.length };
  },

  // 报名唯一性检查
  'POST /registrations/check': async (data) => {
    const exists = registrations.some((r) => r.eventId === Number(data.eventId) && r.idCard === data.idCard);
    return { isUnique: !exists };
  },

  // 创建报名
  'POST /registrations': async (data) => {
    const event = events.find((e) => e.id === Number(data.eventId));
    const eventType = event?.types.find((t) => t.id === Number(data.eventType));
    const newReg = {
      id: registrations.length + 1,
      ...data,
      eventName: event?.name,
      eventTypeName: eventType?.name,
      createdAt: new Date().toISOString(),
    };
    registrations.push(newReg);
    return newReg;
  },

  // 成绩查询
  'GET /scores/query': async (_, config) => {
    const params = new URLSearchParams(config.url.split('?')[1]);
    const idCard = params.get('idCard');
    const result = scores.filter((s) => s.idCard === idCard);
    return { list: result };
  },

  // 成绩列表
  'GET /scores': async (_, config) => {
    const params = new URLSearchParams(config.url.split('?')[1]);
    const page = Number(params.get('page')) || 1;
    const pageSize = Number(params.get('pageSize')) || 10;
    const keyword = params.get('keyword') || '';
    let filtered = scores;
    if (keyword) {
      filtered = scores.filter((s) => s.idCard.includes(keyword) || s.name.includes(keyword));
    }
    const start = (page - 1) * pageSize;
    return { list: filtered.slice(start, start + pageSize), total: filtered.length };
  },

  // 创建成绩
  'POST /scores': async (data) => {
    const event = events.find((e) => e.id === Number(data.eventId));
    const reg = registrations.find((r) => r.idCard === data.idCard);
    const newScore = {
      id: scores.length + 1,
      ...data,
      name: reg?.name || '未知',
      eventName: event?.name,
      eventTypeName: reg?.eventTypeName || '',
    };
    scores.push(newScore);
    return newScore;
  },

  // 更新成绩
  'PUT /scores/:id': async (data, config) => {
    const id = config.url.match(/\/scores\/(\d+)/)?.[1];
    const index = scores.findIndex((s) => s.id === Number(id));
    if (index > -1) {
      scores[index] = { ...scores[index], ...data };
      return scores[index];
    }
    throw { response: { status: 404, data: { message: '成绩不存在' } } };
  },
};

// 匹配路由
const matchRoute = (method, url) => {
  const path = url.replace(/^\/api/, '').split('?')[0];
  
  for (const key of Object.keys(handlers)) {
    const [routeMethod, routePath] = key.split(' ');
    if (routeMethod !== method) continue;

    // 精确匹配
    if (routePath === path) {
      return handlers[key];
    }

    // 带参数匹配 (如 /articles/:id)
    const routeRegex = new RegExp('^' + routePath.replace(/:\w+/g, '\\d+') + '$');
    if (routeRegex.test(path)) {
      return handlers[key];
    }
  }
  return null;
};

// Mock 适配器
export const mockAdapter = async (config) => {
  await delay(150);
  
  const handler = matchRoute(config.method.toUpperCase(), config.url);
  
  if (handler) {
    let requestData = {};
    if (config.data) {
      try {
        requestData = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
      } catch {
        requestData = {};
      }
    }
    const data = await handler(requestData, config);
    return { data, status: 200, statusText: 'OK', headers: {}, config };
  }
  
  console.warn(`[Mock] No handler for ${config.method} ${config.url}`);
  throw new Error(`No mock handler for ${config.method} ${config.url}`);
};
