/**
 * Mock 数据
 */

export const users = [
  { id: 1, username: 'admin', password: 'admin123', permissions: ['admin'] },
  { id: 2, username: 'editor', password: 'editor123', permissions: ['article:publish', 'article:manage'] },
  { id: 3, username: 'registrar', password: 'reg123', permissions: ['registration:view', 'registration:export'] },
  { id: 4, username: 'scorer', password: 'score123', permissions: ['score:manage'] },
];

export const events = [
  { id: 1, name: '2026年春季马拉松', description: '全程42.195公里，挑战自我极限', image: 'https://picsum.photos/400/200?random=1', types: [{ id: 1, name: '全程马拉松' }, { id: 2, name: '半程马拉松' }, { id: 3, name: '迷你马拉松' }] },
  { id: 2, name: '城市自行车赛', description: '环城骑行，感受速度与激情', image: 'https://picsum.photos/400/200?random=2', types: [{ id: 4, name: '专业组' }, { id: 5, name: '业余组' }] },
  { id: 3, name: '游泳锦标赛', description: '泳池竞技，争夺冠军荣耀', image: 'https://picsum.photos/400/200?random=3', types: [{ id: 6, name: '50米自由泳' }, { id: 7, name: '100米蝶泳' }] },
];

export let articles = [
  { id: 1, title: '2026年春季马拉松报名正式开启', author: '管理员', authorId: 1, summary: '一年一度的春季马拉松即将开跑，欢迎各位跑友踊跃报名参加！', content: '<p>一年一度的春季马拉松即将开跑，欢迎各位跑友踊跃报名参加！</p><p>本次比赛设置全程、半程、迷你三个组别，满足不同水平选手的需求。</p>', createdAt: '2026-01-15 10:00:00' },
  { id: 2, title: '赛事安全须知与注意事项', author: '编辑', authorId: 2, summary: '参赛选手请仔细阅读安全须知，确保比赛安全顺利进行。', content: '<p>为确保比赛安全顺利进行，请所有参赛选手仔细阅读以下安全须知：</p><ul><li>赛前做好充分热身</li><li>比赛中注意补水</li><li>如有不适立即停止</li></ul>', createdAt: '2026-01-14 14:30:00' },
  { id: 3, title: '往届冠军分享训练心得', author: '运营', authorId: 1, summary: '听听往届冠军们是如何备战马拉松的，学习他们的训练方法。', content: '<p>马拉松是一项需要长期准备的运动，科学的训练方法至关重要。</p>', createdAt: '2026-01-13 09:00:00' },
];

export let registrations = [
  { id: 1, name: '张三', phone: '13800138001', idCard: '110101199001011234', eventId: 1, eventName: '2026年春季马拉松', eventType: 1, eventTypeName: '全程马拉松', createdAt: '2026-01-10 09:00:00' },
  { id: 2, name: '李四', phone: '13800138002', idCard: '110101199002022345', eventId: 1, eventName: '2026年春季马拉松', eventType: 2, eventTypeName: '半程马拉松', createdAt: '2026-01-11 10:30:00' },
];

export let scores = [
  { id: 1, idCard: '110101199001011234', name: '张三', eventId: 1, eventName: '2026年春季马拉松', eventTypeName: '全程马拉松', score: '3:45:30', rank: 15 },
  { id: 2, idCard: '110101199002022345', name: '李四', eventId: 1, eventName: '2026年春季马拉松', eventTypeName: '半程马拉松', score: '1:52:15', rank: 8 },
];
