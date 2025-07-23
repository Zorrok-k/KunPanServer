import fs from 'fs'
import { resolve } from 'path'
import express from 'express'
import multer from 'multer'
import FileController from '../controllers/FileController'
import Settings from '../../main/settings'

const router = express.Router()

// multer 配置
const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    // 从 req 中获取路径信息 path记得设置一下默认为root
    const path = resolve(Settings.getInstance().server.root, (req.query.path as string) || '')

    // 自动创建目录
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true })
    }

    cb(null, path)
  },
  filename: (_req, file, cb) => {
    // 使用原文件名
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage })

// 文件路由
router.get('/file/build', FileController.build)
router.get('/file/read', FileController.read)
router.post('/file/add', upload.array('normal'), FileController.add)

export default router
