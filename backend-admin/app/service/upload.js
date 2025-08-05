const handleUpload = require('../utils/upload');

exports.file = async (stream, ctx) => {
  const userConfig = ctx.app.config.userConfig;

  const result = await handleUpload(stream, {
    basePath: userConfig.fileServerPath,
    // 子文件夹
    subFolder: 'images',
    // 允许的文件类型，默认为空表示允许所有类型
    allowedTypes: [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'application/vnd.ms-excel', // xls
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
    ],
  });

  if (result.success) {
    return {
      code: 200,
      message: result.message,
      data: { url: result.url },
    };
  }

  return {
    code: 400,
    message: result.message,
  };
};
