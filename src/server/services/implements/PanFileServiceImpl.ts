import { DataSource } from 'typeorm'
import { PanFileService } from '../PanFileService'
import expServer from '../../index'
import { PanFile } from '../../entities/PanFile'
import logger from '../../utils/logger'
import { nanoid } from 'nanoid'

class PanFileServiceImpl implements PanFileService {
  constructor() {}

  buildFileData(): boolean {
    console.log('创建文件数据库')
    return true
  }

  getFileDirectory = (path: string, num: number, page: number): any => {
    // 计算分页参数
    const skip = (page - 1) * num
    expServer
      .getInstance()
      .Database.getRepository(PanFile)
      .createQueryBuilder()
      .skip(skip)
      .take(num)
      .where('path = :path', { path: path })
      .getRawMany()
      .then((res) => {
        logger.info(`[PanFileService] 查询 path：${path} 文件：\n${res}`)
        return res
      })
      .catch((err) => {
        logger.error(`[PanFileService] 发生错误：${err}`)
        return false
      })
  }

  addFile = (path: string, info: []): boolean => {
    logger.info(`[PanFileService] 文件上传：\n路径：${path}\n数量：${info.length}`)
    info.forEach((e) => {
      const file = Object.assign(new PanFile(), JSON.parse(e))
      console.log(file)
      file.id = nanoid(16)
      expServer
        .getInstance()
        .Database.manager.save(file, { entity: PanFile })
        .then(() => {
          logger.info(`[PanFile] 新增一条记录：`)
          console.log(file)
        })
        .catch((err) => {
          logger.error(`[PanFile] 插入数据错误：${err}`)
          return false
        })
    })
    return true
  }
}

export default PanFileServiceImpl
