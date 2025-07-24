/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // 获取 CSRF Token 本地测试用
  router.get('/auth/csrf', controller.common.csrf);
  // 创建用户
  router.post('/auth/createUser', controller.login.createUser);
  // 登录
  router.post('/auth/loginUwk', controller.login.loginUwk);
  // 刷新token
  router.post('/auth/refresh', controller.login.refresh);
  // 获取用户信息
  router.get('/user/getUserInfo', controller.login.getUserInfo);

  // 查询纪念日列表
  router.get('/holiday/list', controller.holiday.list);
  // 新增纪念日
  router.post('/holiday/create', controller.holiday.create);
  // 编辑纪念日
  router.post('/holiday/update', controller.holiday.update);
  // 删除纪念日
  router.post('/holiday/delete', controller.holiday.delete);
};
