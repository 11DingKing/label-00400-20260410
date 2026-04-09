# 赛事管理系统 - 前端

基于 React 18 + Ant Design 5 + Vite 构建的赛事管理系统前端项目。

## 技术栈

- React 18
- Ant Design 5
- React Router 6
- Axios
- React Quill (富文本编辑器)
- Vite (构建工具)

## 环境要求

- Node.js >= 16
- npm >= 8

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000

### 生产构建

```bash
npm run build
```

构建产物在 `dist` 目录

### 预览构建

```bash
npm run preview
```

## 项目结构

```
src/
├── api/              # API 接口
├── components/       # 公共组件
│   ├── Layout/       # 布局组件
│   ├── Loading.jsx   # 加载组件
│   ├── PermissionRoute.jsx  # 权限路由
│   └── RichTextEditor.jsx   # 富文本编辑器
├── mock/             # Mock 数据 (开发环境)
├── pages/            # 页面组件
│   ├── Home/         # 首页
│   ├── Login/        # 登录页
│   ├── Article/      # 文章模块
│   ├── Registration/ # 报名模块
│   ├── Score/        # 成绩模块
│   └── Error/        # 错误页面
├── router/           # 路由配置
├── store/            # 状态管理
├── utils/            # 工具函数
├── App.jsx           # 应用入口
└── main.jsx          # 渲染入口
```

## 功能模块

### 1. 用户认证
- 登录/登出
- JWT Token 管理
- 权限控制

### 2. 首页
- 赛事卡片展示
- 精选文章列表
- 成绩查询入口

### 3. 文章管理
- 文章列表 (分页、搜索)
- 文章发布 (富文本编辑)
- 文章详情
- 文章编辑/删除 (权限控制)

### 4. 报名系统
- 报名表单 (表单校验)
- 动态背景
- 报名列表 (管理员)
- 数据导出

### 5. 成绩查询
- 公共成绩查询
- 成绩管理 (管理员)
- 数据导出

## 测试账号 (Mock 模式)

| 账号 | 密码 | 权限 |
|------|------|------|
| admin | admin123 | 超级管理员 |
| editor | editor123 | 文章发布 |
| registrar | reg123 | 报名管理 |
| scorer | score123 | 成绩管理 |

## API 接口

后端接口基础路径: `/api`

详见 `src/api/index.js`

## 配置说明

### 代理配置

开发环境代理配置在 `vite.config.js`:

```js
proxy: {
  '/api': {
    target: 'http://localhost:8080',
    changeOrigin: true,
  },
}
```

### 环境变量

创建 `.env.local` 文件配置环境变量:

```
VITE_API_BASE_URL=http://your-api-server.com
```

## 浏览器兼容性

- Chrome (最新版)
- Firefox (最新版)
- Edge (最新版)
- Safari (最新版)

## License

MIT
