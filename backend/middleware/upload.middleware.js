const multer = require("multer");

const path = require("path");

const fs = require("fs");

const uploadDir = path.join(
  __dirname,
  "../../uploads"
);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, uploadDir);
  },

  filename: (_, file, cb) => {
    const unique =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9);

    cb(
      null,
      unique +
        path.extname(file.originalname)
    );
  },
});

const fileFilter = (_, file, cb) => {
  const allowed = [
    "image/jpeg",
    "image/png",
    "application/pdf",
  ];

  if (!allowed.includes(file.mimetype)) {
    return cb(
      new Error("Invalid file type"),
      false
    );
  }

  cb(null, true);
};

module.exports = multer({
  storage,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter,
});