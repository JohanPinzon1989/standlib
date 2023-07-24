const multer = require("multer");
const path = require("path");

const storageI = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../../public/file/Imagenes"));
  },

  filename: function (req, file, cb) {
    //cb(null, `${Date.now()}.${file.mimetype.split("/")[1]}`);
    cb(
      null,
      `${file.originalname.split(".")[0]}.${file.mimetype.split("/")[1]}`
    );
  },
});

module.exports = storageI;
