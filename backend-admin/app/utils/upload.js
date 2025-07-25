const fs = require('fs');
const path = require('path');
const multer = require('multer');

/**
 * 创建通用上传中间件
 * @param {Object} options
 * @param {string} options.basePath - 基础存储路径，例如 userConfig.fileServerPath
 * @param {string[]} options.allowedTypes - 允许的文件类型，例如 ['image/jpeg', 'image/png']
 * @param {string} [options.subFolder] - 子文件夹名称（可选），例如按类型区分（images、videos）
*/

const createUploader = (basePath, allowedTypes, subFolder = '') => {
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      const day = currentDate.getDate().toString().padStart(2, '0');
      const dateFolder = `${year}${month}${day}`;
      // 目标存储路径
      const uploadPath = path.join(basePath, subFolder, dateFolder);
      // 判断文件夹是否存在，不存在则创建
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      cb(null, uploadPath);
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, `${Date.now()}${ext}`);
    },
  });


  return multer({
    storage,
    fileFilter: (req, file, cb) => {
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('文件类型不被允许'));
      }
    },
    // 可根据需要添加大小限制
    // limits: { fileSize: 10 * 1024 * 1024 }
  });
};

module.exports = createUploader;
