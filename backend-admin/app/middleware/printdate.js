// 中间件配置
module.exports = (options, app) => {
  const jwt = require('jsonwebtoken');
  const jwtSecret = app.config.jwt.secret || 'your_jwt_secret';

  return async function auth(ctx, next) {
    const url = ctx.url.split('?')[0];
    const public = ctx.url.split('/')[1];

    // 白名单，不校验 token 的接口
    const noValidation1 = [
      '/auth/refresh', '/auth/csrf', '/auth/loginUwk',
    ];
    const noValidation2 = [];

    const state1 = noValidation1.includes(url);
    const state2 = noValidation2.includes(public);

    if (state1 || state2) {
      await next();
      return;
    }

    // 获取 token
    const authHeader = ctx.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      ctx.status = 200;
      ctx.body = { code: 4001, message: '缺少 token，请登录' };
      return;
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      // 验证 token
      const decoded = jwt.verify(token, jwtSecret);
      // 将解密结果挂在 ctx 上，供后续使用
      ctx.state.user = decoded.data;
      await next();
      return;
    } catch (err) {
      ctx.status = 200;
      ctx.body = { code: 4002, message: 'token 无效或已过期，请重新登录' };
      return;
    }
  };
};
