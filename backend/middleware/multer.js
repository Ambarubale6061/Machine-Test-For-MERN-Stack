import multer from "multer";
import path from "path";

// Set storage destination and file name
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // folder to store uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// File filter to accept only CSV/XLS/XLSX
const fileFilter = (req, file, cb) => {
  const fileTypes = /csv|xls|xlsx/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  if (extname) {
    cb(null, true);
  } else {
    cb(new Error("Only CSV, XLS, XLSX files are allowed"));
  }
};

export const upload = multer({ storage, fileFilter });
