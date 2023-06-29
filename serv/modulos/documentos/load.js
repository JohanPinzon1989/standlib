const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../../../public/doc/uploades"),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}+${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

exports.upload = upload.single("pdf");
