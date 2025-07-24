'use strict';

const Service = require('egg').Service;

class HolidayService extends Service {
  // 查询纪念日列表
  async list(query) {
    const { app } = this;
    const page = Number(query.page) || 1; // 当前页码，默认第1页
    const pageSize = Number(query.pageSize) || 10; // 每页条数，默认10条

    // 构造 where 查询条件（不包括分页字段）
    const conditions = { ...query };
    delete conditions.page;
    delete conditions.pageSize;

    try {
      // 查询总条数
      const total = await app.mysql.count('holidays_list', conditions);

      // 查询分页数据
      const result = await app.mysql.select('holidays_list', {
        where: conditions,
        orders: [[ 'date', 'asc' ]], // 按照日期升序排列
        limit: pageSize,
        offset: (page - 1) * pageSize,
      });

      return {
        code: 200,
        message: '查询成功',
        data: {
          data: result,
          total,
        },
      };
    } catch (err) {
      return { code: 500, message: '查询失败', error: err };
    }
  }

  // 新增纪念日
  async create(data) {
    const { app } = this;
    try {
      const result = await app.mysql.insert('holidays_list', data);
      if (result.affectedRows === 1) {
        return { code: 200, message: '新增成功' };
      }
      return { code: 500, message: '新增失败' };
    } catch (err) {
      return { code: 500, message: '新增失败', error: err };
    }
  }

  // 编辑纪念日
  async update(data) {
    const { app } = this;
    const { id, ...rest } = data;
    if (!id) {
      return { code: 400, message: '缺少 id 参数' };
    }
    try {
      const result = await app.mysql.update('holidays_list', rest, {
        where: { id },
      });
      if (result.affectedRows === 1) {
        return { code: 200, message: '更新成功' };
      }
      return { code: 500, message: '更新失败' };
    } catch (err) {
      return { code: 500, message: '更新失败', error: err };
    }
  }

  // 删除纪念日
  async delete({ id }) {
    const { app } = this;
    if (!id) {
      return { code: 400, message: '缺少 id 参数' };
    }
    try {
      const result = await app.mysql.delete('holidays_list', {
        id,
      });
      if (result.affectedRows === 1) {
        return { code: 200, message: '删除成功' };
      }
      return { code: 500, message: '删除失败' };
    } catch (err) {
      return { code: 500, message: '删除失败', error: err };
    }
  }
}

module.exports = HolidayService;
