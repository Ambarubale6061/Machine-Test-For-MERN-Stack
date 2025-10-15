import express from "express";
import { uploadTasks } from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

// CSV/XLS/XLSX
router.post("/upload", protect, upload.single("file"), uploadTasks);

export default router;
