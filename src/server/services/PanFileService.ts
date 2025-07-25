export interface PanFileService {
  // 扫描根目录建立文件数据库
  buildFileData(root: string): Promise<boolean>

  // 读取当前路径下文件目录 分页查询
  getFileDirectory(directory: string, num: number, page: number): Promise<boolean>

  // 上传文件
  addFile(path: string, info: []): boolean
}
