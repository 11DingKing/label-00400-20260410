/**
 * 路由配置
 */
import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import { AuthRoute, PermissionRoute } from '../components/PermissionRoute';
import { PERMISSIONS } from '../utils/auth';

// 页面组件
import Home from '../pages/Home';
import Login from '../pages/Login';
import ArticleList from '../pages/Article/List';
import ArticleDetail from '../pages/Article/Detail';
import ArticlePublish from '../pages/Article/Publish';
import RegistrationForm from '../pages/Registration/Form';
import RegistrationList from '../pages/Registration/List';
import ScoreQuery from '../pages/Score/Query';
import ScoreManage from '../pages/Score/Manage';
import NotFound from '../pages/Error/404';
import Forbidden from '../pages/Error/403';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'articles', element: <ArticleList /> },
      { path: 'article/:id', element: <ArticleDetail /> },
      {
        path: 'article/publish',
        element: (
          <PermissionRoute permission={PERMISSIONS.ARTICLE_PUBLISH}>
            <ArticlePublish />
          </PermissionRoute>
        ),
      },
      {
        path: 'article/edit/:id',
        element: (
          <AuthRoute>
            <ArticlePublish />
          </AuthRoute>
        ),
      },
      { path: 'registration/:eventId', element: <RegistrationForm /> },
      {
        path: 'registrations',
        element: (
          <PermissionRoute permission={PERMISSIONS.REGISTRATION_VIEW}>
            <RegistrationList />
          </PermissionRoute>
        ),
      },
      { path: 'score-query', element: <ScoreQuery /> },
      {
        path: 'score-manage',
        element: (
          <PermissionRoute permission={PERMISSIONS.SCORE_MANAGE}>
            <ScoreManage />
          </PermissionRoute>
        ),
      },
      { path: '403', element: <Forbidden /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  { path: '/login', element: <Login /> },
]);

export default router;
