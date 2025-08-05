const { Controller } = require('egg');

class UploadController extends Controller {
  async file() {
    const { ctx, service } = this;
    const stream = await ctx.getFileStream(); // ✅ 只在这里读取一次 multipart
    const result = await service.upload.file(stream, ctx); // ✅ 把 stream 传下去
    ctx.body = result;
  }
}

module.exports = UploadController;
