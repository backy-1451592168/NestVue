import axios from 'axios';
import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
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

    // 1. token 过期，尝试使用 refreshToken 无感刷新重新获取 token
    if (code === 4002) {
      return refreshTokenAndRetry(config);
    }

    // 2. 处理业务状态码
    const isHandled = handleCustomCode(code, data.message);
    if (isHandled) return data;

    // 3. 其他业务错误
    // message.error(data.message || '请求失败');
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
      return false;
    case 4003:
      message.error('缺少 refreshToken，请重新登录');
      logoutAndRedirect('/login');
      return false;
    case 4004:
      message.error('refreshToken 已失效，请重新登录');
      logoutAndRedirect('/login');
      return false;
    case 201:
      message.success(msg);
      return true;
    case 200:
      return true;
    default:
      message.error(msg || '请求失败');
      return false;
  }
};

// ✅ 登出并跳转到登录页
const logoutAndRedirect = (path: string) => {
  localStorage.removeItem('SOY_token');
  localStorage.removeItem('SOY_refreshToken');

  // 这样写的作业是 确保响应式值被稳定访问
  const currentRoute = router.currentRoute.value; // ✅ 拿整个对象（不是只拿 .fullPath）

  const fullPath = currentRoute.fullPath;

  if (path === '/' || fullPath === '/') {
    router.push(path);
  } else {
    router.push({
      path,
      query: { redirect: fullPath },
      /***
       * 无法刷新页面才加了这个参数
       * 特殊场景：用 :key="$route.fullPath" 更保险
       */
      replace: true, // ✅ 避免浏览器记录重复历史，用新地址替换当前历史记录中的地址，而不是在历史栈中新增一条记录。
    });
  }
};

let isRefreshing = false;
let requestQueue: ((newToken: string) => void)[] = [];

// 封装刷新逻辑
async function refreshTokenAndRetry(originalConfig: AxiosRequestConfig) {
  const refreshToken = localStorage.getItem('SOY_refreshToken');
  if (!refreshToken) throw new Error('缺少 refreshToken');

  if (isRefreshing) {
    // 如果正在刷新中，返回一个等待 Promise，直到 token 刷新完
    return new Promise((resolve) => {
      requestQueue.push((newToken: string) => {
        originalConfig.headers = {
          ...originalConfig.headers,
          Authorization: `Bearer ${newToken}`,
        };
        resolve(service(originalConfig));
      });
    });
  }

  isRefreshing = true;

  try {
    const refreshRes = await axios.post(
      '/api/auth/refresh',
      {},
      {
        headers: { Authorization: `Bearer ${refreshToken}` },
      },
    );

    const { code, data: tokenData, message } = refreshRes.data;
    if (code !== 200) throw new Error(message || '刷新失败');

    const newToken = tokenData.token;
    localStorage.setItem('SOY_token', newToken);

    // 执行队列
    requestQueue.forEach((cb) => cb(newToken));
    requestQueue = [];

    // 当前请求重试
    originalConfig.headers = {
      ...originalConfig.headers,
      Authorization: `Bearer ${newToken}`,
    };
    return service(originalConfig);
  } catch (err) {
    // 刷新失败：清空队列 + 统一跳转登录
    requestQueue = [];
    logoutAndRedirect('/login');
    return Promise.reject(err);
  } finally {
    isRefreshing = false;
  }
}

export default service;
