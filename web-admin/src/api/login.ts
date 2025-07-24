// api.ts
import request from '@/utils/request';

interface LoginResponse {
  code: number;
  message: string;
  data: { id: number; user_name: string; token: string; refreshToken: string };
}
class Api {
  // 登录
  loginUwk(data: object): Promise<LoginResponse> {
    return request({
      url: '/api/auth/loginUwk',
      method: 'post',
      data,
    });
  }

  // 创建用户
  createUser() {
    return request({
      url: '/api/auth/createUser',
      method: 'post',
    });
  }

  // 获取用户信息
  getUserInfo() {
    return request({
      url: '/api/user/getUserInfo',
      method: 'get',
    });
  }
}

export default new Api();
