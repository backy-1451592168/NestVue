// 服务配置信息
module.exports = {
  // 微信小程序  开发管理-开发设置-开发者ID
  wechat: {
    appid: 'wx0a63faf0a14077e4',
    secret: '7c8fef641dfc27987a42bbfb23bf355c',
  },
  // QQ邮箱
  qqEmail: {
    user_email: 'daycountdown@qq.com',
    auth_code: 'yrokcdguwjppjfgb',
  },
  // 数据库
  database: {
    // dell物理机--本地
    // host: '1Panel-mysql-6eiz', // 容器启动的情况下，用容器的名称
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: '9595Sjh@mysql...',
    database: 'jnr_database',

    // dell物理机--公网
    // host: 's1.z100.vip',
    // port: '34145',
    // user: 'root',
    // password: '9595Sjh@mysql...',
    // database: 'jnr_database'

    // 本地
    // host: '127.0.0.1',
    // port: '3306',
    // user: 'root',
    // password: '9595sjh...',
    // database: 'jnr_database'
  },
  // 文件存储路径
  fileStorage: {
    // 本地路径
    // fileServerPath: '/Users/sujunhao/Downloads/user_file' // 本地
    // 服务器路径
    // fileServerPath: '/home/data/file/jnr/user_file' // 阿里云

    fileServerPath: '/home/data/jnr_app_file/user_file', // 物理机 -- 宿主机
    // fileServerPath: '/user_file' // 物理机 --容器写法，要在容器设置挂载点,容器挂载宿主机的路径了/home/data/jnr_app_file/user_file
  },
};
