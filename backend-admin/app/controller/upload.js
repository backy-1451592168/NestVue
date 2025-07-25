const { Controller } = require('egg');

class UploadController extends Controller {
  async list() {
    const { ctx, service } = this;
    const result = await service.upload.upload_image(ctx.request.body);
    ctx.body = result;
  }
}

module.exports = UploadController;
