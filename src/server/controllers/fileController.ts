import PanFileServiceImpl from '../services/implements/PanFileServiceImpl'
import { PanFileService } from '../services/PanFileService'

class fileController {
  // 依赖注入
  private panFileService: PanFileService

  constructor(panFileService: PanFileService) {
    this.panFileService = panFileService
  }

  build = (_req: any, res: any, _next: any) => {
    if (this.panFileService.buildFileData()) {
      res.send('建立文件数据库')
    }
  }

  read = (req: any, res: any, _next: any) => {
    const result = this.panFileService.getFileDirectory(
      req.query.path,
      req.query.num,
      req.query.page
    )
    if (result == false) {
      res.status(500).json({
        code: 500,
        message: '未知错误！'
      })
      return
    }
    res.status(200).json({
      code: 200,
      data: result
    })
  }

  add = (req: any, res: any, _next: any) => {
    if (this.panFileService.addFile(req.query.path, req.body.info)) {
      res.status(201).json({
        code: 201,
        data: 'OK'
      })
      return
    }
    res.status(500).json({
      code: 500,
      message: '文件上传失败！'
    })
  }
}

export default new fileController(new PanFileServiceImpl())
