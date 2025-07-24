'use strict';

const Controller = require('egg').Controller;

class HolidayController extends Controller {
  // 查询纪念日
  async list() {
    const { ctx, service } = this;
    const result = await service.holiday.list(ctx.query);
    ctx.body = result;
  }

  // 新增纪念日
  async create() {
    const { ctx, service } = this;
    const result = await service.holiday.create(ctx.request.body);
    ctx.body = result;
  }

  // 编辑纪念日
  async update() {
    const { ctx, service } = this;
    const result = await service.holiday.update(ctx.request.body);
    ctx.body = result;
  }

  // 删除纪念日
  async delete() {
    const { ctx, service } = this;
    const result = await service.holiday.delete(ctx.request.body);
    ctx.body = result;
  }
}

module.exports = HolidayController;
