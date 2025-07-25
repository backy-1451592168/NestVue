const createUploader = require('../utils/upload');
const config = require('../config/index'); // 引入配置
const path = require('path');

const userConfig = config.userConfig;

const imageUploader = createUploader({
  basePath: userConfig.fileServerPath,
  allowedTypes: [ 'image/jpeg', 'image/png', 'image/jpg' ],
  subFolder: 'images', // 可以根据上传类型做分类
});

exports.upload_image = (req, res) => {
  imageUploader.single('file')(req, res, err => {
    if (err) {
      console.error(new Date(), '：', err);
      return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const dateFolder = `${year}${month}${day}`;

    const filePath = path.join('/user_file', 'images', dateFolder, req.file.filename);

    res.send({
      state: 200,
      msg: '上传成功',
      data: { url: filePath },
    });
  });
};
