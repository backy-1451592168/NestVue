const fs = require('fs');
const path = require('path');
const sendToWormhole = require('stream-wormhole');

async function handleUpload(stream, options) {
  const { basePath, allowedTypes, subFolder = '' } = options;

  if (!stream || !stream.filename || !stream.mimeType) {
    return {
      success: false,
      message: '请选择要上传的文件',
    };
  }

  if (!allowedTypes.includes(stream.mimeType)) {
    await sendToWormhole(stream);
    return {
      success: false,
      message: '不支持的文件类型',
    };
  }

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const dateFolder = `${year}${month}${day}`;
  const folderPath = path.join(basePath, subFolder, dateFolder);
  fs.mkdirSync(folderPath, { recursive: true });

  const filename = `${Date.now()}_${stream.filename}`;
  const targetPath = path.join(folderPath, filename);
  const writeStream = fs.createWriteStream(targetPath);

  try {
    await stream.pipe(writeStream);
    return {
      success: true,
      message: '上传成功',
      url: path.join('/user_file', subFolder, dateFolder, filename),
    };
  } catch (err) {
    await sendToWormhole(stream);
    return {
      success: false,
      message: '文件保存失败',
    };
  }
}

module.exports = handleUpload;
