import Server from '../index'
import Settings from '../../main/settings'
import PanFileServiceImpl from '../services/implements/PanFileServiceImpl'
import { PanFileService } from '../services/PanFileService'
import logger from '../utils/logger'
import PanFile from '../entities/PanFile'

class FileController {
  // 依赖注入
  private panFileService: PanFileService

  constructor(panFileService: PanFileService) {
    this.panFileService = panFileService
  }

  build = async (_req: any, res: any, _next: any) => {
    logger.info(`[PanFileService] 清除文件数据库`)
    await Server.getInstance().Database.getRepository(PanFile).clear()
    logger.info(`[PanFileService] 建立文件数据库  路径：${Settings.getInstance().server.root}`)
    this.panFileService.buildFileData(Settings.getInstance().server.root).then((result) => {
      if (result === true) {
        res.status(200).json({
          code: 200,
          data: 'ok'
        })
      } else {
        res.status(500).json({
          code: 500,
          message: '未知错误！'
        })
      }
    })
  }

  read = (req: any, res: any, _next: any) => {
    this.panFileService
      .getFileDirectory(req.query.path, req.query.num, req.query.page)
      .then((result) => {
        if (res == false) {
          res.status(500).json({
            code: 500,
            message: '未知错误！'
          })
          return
        } else {
          res.status(200).json({
            code: 200,
            data: result
          })
        }
      })
      .catch((err) => {
        logger.error(`[Route /files] 获取文件列表失败：${err.message}`)
        res.status(500).json({ error: err.message })
      })
  }

  add = (req: any, res: any, _next: any) => {
    if (this.panFileService.addFile(req.query.path, req.body.info)) {
      res.status(200).json({
        code: 200,
        data: 'ok'
      })
      return
    }
    res.status(500).json({
      code: 500,
      message: '文件上传失败！'
    })
  }
}

export default new FileController(new PanFileServiceImpl())
