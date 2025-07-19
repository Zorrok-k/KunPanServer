// import { PanFile } from "@entities/PanFile";
import { PanFileService } from "@services/PanFileService";

class PanFileServiceImpl implements PanFileService {
  buildFileData(): boolean {
    console.log("创建文件数据库");
    return true;
  }

  getFileDirectory(_path: string, _num: number, _page: number): any {
    return "test";
  }
}

export default PanFileServiceImpl;
