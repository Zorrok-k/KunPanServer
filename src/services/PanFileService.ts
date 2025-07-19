import { PanFile } from "@entities/PanFile";

export interface PanFileService {
  // 扫描根目录建立文件数据库
  buildFileData(): boolean;

  // 读取当前路径下文件目录 分页查询
  // getFileDirectory(path: string, num: number, page: number): PanFile[];
  getFileDirectory(path: string, num: number, page: number): any;

  // 上传文件
  // addFile()
}
