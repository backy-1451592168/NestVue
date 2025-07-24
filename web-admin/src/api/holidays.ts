// api.ts
import request from '@/utils/request';

// 纪念日单项结构
export interface HolidayItem {
  id?: number;
  date: string;
  name: string;
  day: number;
  week: string;
  img?: string;
  color?: string;
  date_name?: string;
}

// 通用响应结构
interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data?: T;
}

// 纪念日列表响应
interface HolidayListResponse {
  data: HolidayItem[];
  total: number;
}

class Api {
  // 获取纪念日列表
  getHolidayList(params?: object): Promise<ApiResponse<HolidayListResponse>> {
    return request({
      url: '/api/holiday/list',
      method: 'get',
      params,
    });
  }

  // 新增纪念日
  createHoliday(data: HolidayItem): Promise<ApiResponse> {
    return request({
      url: '/api/holiday/create',
      method: 'post',
      data,
    });
  }

  // 编辑纪念日
  updateHoliday(data: HolidayItem): Promise<ApiResponse> {
    return request({
      url: '/api/holiday/update',
      method: 'post',
      data,
    });
  }

  // 删除纪念日
  deleteHoliday(id: number): Promise<ApiResponse> {
    return request({
      url: '/api/holiday/delete',
      method: 'post',
      data: { id },
    });
  }
}

export default new Api();
