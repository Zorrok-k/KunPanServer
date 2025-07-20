import fs from "fs";
// import { PanFile } from "@entities/PanFile";
import { PanFileService } from "../PanFileService";

class PanFileServiceImpl implements PanFileService {
  buildFileData(): boolean {
    console.log("创建文件数据库");
    return true;
  }

  getFileDirectory(_path: string, _num: number, _page: number): any {
    return "test";
  }

  addFile(path: string, files: File[]): boolean {
    console.log(path + "\n");
    
    let filesDetails: any[] = [];
    files.forEach((e) => {
      filesDetails.push(fs.statSync(Object.assign(e).path));
    });
    console.log(filesDetails);

    return true;
  }
}

export default PanFileServiceImpl;
