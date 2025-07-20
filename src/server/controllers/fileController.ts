import PanFileServiceImpl from "../services/implements/PanFileServiceImpl";
import { PanFileService } from "../services/PanFileService";

class fileController {
  // 依赖注入
  private panFileService: PanFileService;

  constructor(panFileService: PanFileService) {
    this.panFileService = panFileService;
  }

  build = (_req: any, res: any, _next: any) => {
    if (this.panFileService.buildFileData()) {
      res.send("建立文件数据库");
    }
  };

  add = (req: any, res: any, _next: any) => {
    if (this.panFileService.addFile(req.query.path, req.files)) {
      res.status(200).json({
        code: 200,
        data: "OK",
      });
      return;
    }
    res.status(500).json({
      code: 500,
      message: "文件上传失败！",
    });
  };
}

export default new fileController(new PanFileServiceImpl());
