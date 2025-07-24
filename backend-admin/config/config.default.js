/* eslint valid-jsdoc: "off" */

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */

const os = require('os');
// 获取本机ip
function getIpAddress() {
  // os.networkInterfaces() 返回一个对象，该对象包含已分配了网络地址的网络接口
  const interfaces = os.networkInterfaces();
  for (const devName in interfaces) {
    const iface = interfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
}
const myHost = getIpAddress();

module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {
    // 数据库配置
    mysql: {
      // 单数据库信息配置
      client: {
        host: myHost,
        // host: '1Panel-mysql-6eiz', // 容器启动的情况下，用容器的名称
        port: '3306',
        // 用户名
        user: 'root',
        // 密码
        password: '9595sjh...',
        // 数据库名
        database: 'jnr_database',
      },
      // 是否加载到 app 上，默认开启
      app: true,
      // 是否加载到 agent 上，默认关闭
      agent: false,
    },
    cluster: {
      listen: {
        path: '',
        port: 6666,
        hostname: myHost, // 当前本地网络ip地址
      },
      // workers: 4
    },
    // 登录验证密钥
    jwt: {
      secret: 's0m3V3ry$ecur3Str1ng!2025',
    },
    security: {
      csrf: {
        enable: false, // 关闭 CSRF 校验
      },
    },
  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1751854721117_6257';

  // 中间件配置  挂载中间件  按顺序执行
  config.middleware = [ 'printdate' ];

  // 代理  配置跨域允许访问的IP地址  https://blog.csdn.net/qq_33124323/article/details/105074292
  config.cors = {
    origin: '*', // 只允许这个域进行访问接口
    credentials: true, // 开启认证
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
