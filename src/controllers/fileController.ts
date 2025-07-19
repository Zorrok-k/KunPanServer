import PanFileServiceImpl from "@services/implements/PanFileServiceImpl";
import { PanFileService } from "@services/PanFileService";

class fileController {
  // 依赖注入
  private panFileService: PanFileService;

  constructor(panFileService: PanFileService) {
    this.panFileService = panFileService;
  }

  build = (_req: any, res: any, _next: any) =>{
    if (this.panFileService.buildFileData()) {
      res.send("建立文件数据库");
    }
  }
}

export default new fileController(new PanFileServiceImpl());
