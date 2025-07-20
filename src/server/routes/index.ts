import fs from "fs";
import { join } from "path";
import express from "express";
import multer from "multer"; 
import fileController from "../controllers/fileController";

const root = "D:";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    // 从 req 中获取路径信息 path记得设置一下默认为root
    const path = join(root, (req.query.path as string) || "");

    // 自动创建目录
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }

    cb(null, path);
  },
  filename: (_req, file, cb) => {
    // 使用原文件名
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// 文件路由
router.get("/file/build", fileController.build);
router.post("/file/add", upload.array("normal"), fileController.add);

export default router;
