const { Controller } = require('egg');

class HomeController extends Controller {
  async csrf() {
    const { ctx } = this;
    ctx.body = {
      code: 200,
      message: '获取成功',
      data: {
        csrfToken: ctx.csrf, // ← Egg 自动挂载的 CSRF Token
      },
    };
  }
}

module.exports = HomeController;
