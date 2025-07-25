// 服务配置信息
module.exports = {
  // 数据库
  database: {
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

    fileServerPath: '/home/data/jnr_app_file/user_file', // 物理机 -- 宿主机
    // fileServerPath: '/user_file' // 物理机 --容器写法，要在容器设置挂载点,容器挂载宿主机的路径了/home/data/jnr_app_file/user_file
  },
};
