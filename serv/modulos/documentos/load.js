const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../../public/file/uploaders"));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}.${file.mimetype.split("/")[1]}`);
  },
});

module.exports = storage;
