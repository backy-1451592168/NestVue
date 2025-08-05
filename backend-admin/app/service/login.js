'use strict';
const crypto = require('crypto');
// 创建和验证 JWT（JSON Web Token） 的库，帮你生成安全的登录凭证和身份验证令牌。简单说，就是帮你发“通行证”和检查“通行证”是否合法。
const jwt = require('jsonwebtoken');

const Service = require('egg').Service;
class UserService extends Service {
  // 创建用户
  async createUser({ user_name, password }) {
    const { app } = this;

    // 先查账号是否存在
    const existUser = await app.mysql.get('user_admin', { user_name });
    if (existUser) {
      return { code: 401, message: '用户名已存在' };
    }

    // 生成盐
    const password_salt = crypto.randomBytes(8).toString('hex'); // 16位salt

    // 加密密码
    const hash = crypto.createHash('sha256');
    hash.update(password + password_salt);
    const encryptedPassword = hash.digest('hex');
    const now = new Date();
    // 插入数据库
    const result = await app.mysql.insert('user_admin', {
      user_name,
      password: encryptedPassword,
      password_salt,
      update_time: now,
      create_time: now,
    });

    if (result.affectedRows === 1) {
      return { code: 200, message: '用户创建成功' };
    }

    return { code: 500, message: '创建失败' };
  }

  // 登录逻辑
  async login_uwk({ user_name, password }) {
    const { app } = this;

    // 1. 查询用户
    const user = await app.mysql.get('user_admin', { user_name });
    if (!user) {
      return { code: 401, message: '用户不存在' };
    }

    const { password_salt, password: dbPassword } = user;

    // 2. 加密输入密码，和数据库密码比对
    const hash = crypto.createHash('sha256');
    hash.update(password + password_salt);
    const encryptedInputPassword = hash.digest('hex');
    if (encryptedInputPassword !== dbPassword) {
      return { code: 401, message: '密码错误' };
    }

    // 3. 登录成功，更新 update_time
    await app.mysql.update('user_admin', {
      update_time: new Date(),
    }, {
      where: { user_name },
    });

    // 4. 生成 JWT Token 和 Refresh Token
    // jwtSecret 和 jwtExpire 要放在 config 里管理
    const jwtSecret = app.config.jwt.secret || 'your_jwt_secret';
    /**
      作用：代表用户身份，用来访问受保护的接口。
      前端：请求接口时，带上 token（一般放 HTTP Header 里，比如 Authorization: Bearer <token>）。
      后端：验证 token 是否有效，判断请求是不是合法，是否允许访问资源。
     */
    const token = jwt.sign(
      { data: { userName: user.user_name } },
      jwtSecret,
      { expiresIn: '1h' } // token 有效期 1 小时
    );
    /**
      作用：当 token 过期后，用它来换取新的 token，避免用户频繁重新登录。
      前端：token 过期时，自动用 refreshToken 请求新的 token。
      后端：验证 refreshToken，给前端发一个新的 token（可能也会发新 refreshToken）。

      token 过期后，前端检测到接口返回“token 失效”或“401 未授权”。
      前端自动调用一个专门的刷新接口（比如 /auth/refresh），把 refreshToken 放到请求里发送给后端。
     */
    const refreshToken = jwt.sign(
      { data: { userName: user.user_name } },
      jwtSecret,
      { expiresIn: '7d' } // refreshToken 有效期 7 天 7d
    );
    // 5. 返回结果
    return {
      code: 201,
      message: '登录成功',
      data: {
        user_name: user.user_name,
        id: user.id,
        token,
        refreshToken,
      },
    };
  }

  // 刷新token
  async refresh() {
    const { ctx, app } = this;
    const authHeader = ctx.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        code: 4003,
        message: '缺少 refreshToken',
      };
    }

    const refreshToken = authHeader.replace('Bearer ', '');
    const jwtSecret = app.config.jwt.secret || 'your_jwt_secret';
    try {
      const decoded = jwt.verify(refreshToken, jwtSecret);
      const newToken = jwt.sign(
        { data: decoded.data },
        jwtSecret,
        { expiresIn: '1h' }
      );
      return {
        code: 200,
        message: 'token 刷新成功',
        data: {
          token: newToken,
        },
      };
    } catch (err) {
      return {
        code: 4004,
        message: 'refreshToken 无效或已过期',
      };
    }
  }

  // 获取用户信息
  async getUserInfo() {
    const { ctx, app } = this;
    try {
      const jwt = require('jsonwebtoken');
      const authHeader = ctx.headers.authorization;
      const token = authHeader.replace('Bearer ', '');

      // 自己解析 token 获取 userName
      const decoded = jwt.verify(token, app.config.jwt.secret);
      const userName = decoded.data.userName;
      // 用 userName 去数据库查用户
      const user = await app.mysql.get('user_admin', { user_name: userName });
      if (!user) {
        return {
          code: 4001,
          message: '用户不存在',
        };
      }
      return {
        code: 200,
        message: '获取成功',
        data: {
          userName: user.user_name,
          userId: user.id,
        },
      };
    } catch (err) {
      ctx.logger.error('getUserInfo error:', err);
      return {
        code: 500,
        message: '服务器错误',
      };
    }
  }

}

module.exports = UserService;
