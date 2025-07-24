'use strict';

const Controller = require('egg').Controller;


class UserController extends Controller {
  async createUser() {
    const { ctx, service } = this;
    const { user_name, password } = ctx.request.body;

    if (!user_name || !password) {
      ctx.body = { code: 400, message: '用户名和密码不能为空' };
      return;
    }

    const result = await service.login.createUser({ user_name, password });
    ctx.body = result;
  }
  // 登录
  async loginUwk() {
    const { ctx, service } = this;
    const result = await service.login.login_uwk(ctx.request.body);
    ctx.body = result;
  }

  async refresh() {
    const { ctx, service } = this;
    const result = await service.login.refresh(ctx.request.body);
    ctx.body = result;
  }

  async getUserInfo() {
    const { ctx, service } = this;
    const result = await service.login.getUserInfo(ctx.request.body);
    ctx.body = result;
  }
}

module.exports = UserController;
