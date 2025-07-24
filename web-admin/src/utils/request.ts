import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import router from '@/router';
import message from '@/utils/naiveui/message.ts';

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
});

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('SOY_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 响应拦截器
service.interceptors.response.use(
  async (response: AxiosResponse) => {
    const { data, config } = response;
    const code = data.code;

    // 1. 正常情况直接返回
    if (response.status === 200 && code !== 4001 && code !== 4002) {
      handleCustomCode(code, data.message);
      return data;
    }

    // 2. token 过期，尝试使用 refreshToken 无感刷新重新获取 token
    if (code === 4001 || code === 4002) {
      try {
        const refreshToken = localStorage.getItem('SOY_refreshToken');
        if (!refreshToken) throw new Error('缺少 refreshToken');

        const refreshRes = await axios.post(
          '/api/auth/refresh',
          {},
          {
            headers: { Authorization: `Bearer ${refreshToken}` },
          },
        );

        if (refreshRes.data.code === 200) {
          const newToken = refreshRes.data.data.token;

          // 更新 localStorage
          localStorage.setItem('SOY_token', newToken);

          // 重新发起原请求（带上新 token）
          const { headers, ...restConfig } = config;
          return service({
            ...restConfig,
            headers: {
              ...headers,
              Authorization: `Bearer ${newToken}`,
            },
          });
        } else {
          handleCustomCode(refreshRes.data.code, refreshRes.data.message);
          throw new Error('刷新失败，联系管理员！');
        }
      } catch (err) {
        logoutAndRedirect('/login');
        return Promise.reject(err);
      }
    }

    // 3. 其他业务错误
    message.error(data.message || '请求失败');
    return Promise.reject(data);
  },
  (error) => {
    // 浏览器错误代码
    const status = error.response?.status;

    if (status === 401) {
      message.error('未授权，请重新登录');
      logoutAndRedirect('/login');
    } else if (status === 500) {
      message.error('服务器异常，请稍后再试');
      logoutAndRedirect('/');
    } else {
      message.error(error.message || '网络异常，请稍后重试');
      logoutAndRedirect('/');
    }
    return Promise.reject(error);
  },
);

// ✅ 状态码处理函数（自定义业务状态码）
const handleCustomCode = (code: number, msg: string) => {
  switch (code) {
    case 4001:
      message.error('未登录，请重新登录');
      logoutAndRedirect('/login');
      break;
    case 4003:
      message.error('缺少 refreshToken，请重新登录');
      logoutAndRedirect('/login');
      break;
    case 4004:
      message.error('refreshToken 已失效，请重新登录');
      logoutAndRedirect('/login');
      break;
    case 201:
      message.success(msg);
      break;
    default:
      break;
  }
};

// ✅ 登出并跳转到登录页
const logoutAndRedirect = (path: string) => {
  localStorage.removeItem('SOY_token');
  localStorage.removeItem('SOY_refreshToken');

  const currentRoute = router.currentRoute.value.fullPath;
  if (path === '/' || currentRoute === '/') {
    router.push(path);
  } else {
    router.push({
      path,
      query: { redirect: currentRoute },
    });
  }
};

export default service;
