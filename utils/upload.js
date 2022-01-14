const multer = require('multer');
const uploadLocalDir = './uploads';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadLocalDir);
  },
  filename: function (req, file, cb) {
    const fileType = file.originalname.split(".").pop();
    cb(null, `${file.fieldname}-${Date.now()}.${fileType}`);
  }
});

exports.uploadFileToServer = multer({ storage });
