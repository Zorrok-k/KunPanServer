import { PanFileService } from '../PanFileService'
import PanFile from '../../entities/PanFile'
import Server from '../../index'
import logger from '../../utils/logger'
import Settings from '../../../main/settings'
import { customAlphabet } from 'nanoid'
import fs from 'fs'
import { getTypeNum } from '../../utils/fileType'
import { basename, extname, relative, join } from 'path'

class PanFileServiceImpl implements PanFileService {
  async buildFileData(root: string): Promise<boolean> {
    logger.info(`[PanFileService] 当前目录：${root}`)
    try {
      const rootFiles = fs.readdirSync(root)

      for (const e of rootFiles) {
        const fullPath = join(root, e)
        const info = fs.statSync(fullPath)
        const file = new PanFile()

        // 忽略快捷方式
        if (info.isSymbolicLink()) {
          continue
        }

        // 文件夹：递归处理
        if (info.isDirectory()) {
          await this.buildFileData(fullPath)
        }

        // 设置基础文件信息
        file.id = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 16)()
        file.suffix = extname(e)
        file.name = basename(e, file.suffix)
        file.size = info.size
        file.create = info.birthtimeMs
        file.update = info.mtimeMs
        file.directory = '\\' + relative(Settings.getInstance().server.root, root)
        file.path = '\\' + relative(Settings.getInstance().server.root, fullPath)
        file.type = -1 // 默认设为文件夹类型

        // 如果是文件，异步获取真实类型
        if (!info.isDirectory()) {
          try {
            logger.info(`[PanFileService] 异步获取文件类型 路径：${fullPath}`)
            file.type = await getTypeNum(fullPath)
          } catch (err) {
            logger.error(`[PanFileService] 异步获取文件类型失败 路径：${fullPath}\n${err}`)
            // 可选：continue 跳过该文件 或 继续保存为默认类型
          }
        }

        // 保存到数据库
        try {
          await Server.getInstance().Database.manager.save(file, { entity: PanFile })
          logger.info(
            `[PanFile] 新增一条记录：{ID: ${file.id},文件名: ${file.name},文件后缀: ${file.suffix},文件大小字节: ${file.size},创建时间时间戳: ${file.create},最后修改时间时间戳: ${file.update},相对路径: ${file.path},类型: ${file.type}}`
          )
        } catch (err: any) {
          logger.error(`[PanFile] 插入数据错误：${err.message}`)
          // 可选：抛出错误或继续
        }
      }

      return true
    } catch (err: any) {
      logger.error(`[PanFileService] 构建文件数据时发生错误：${err.message}`)
      throw err
    }
  }

  async getFileDirectory(directory: string, num: number, page: number): Promise<any> {
    const skip = (page - 1) * num

    try {
      const result = await Server.getInstance()
        .Database.getRepository(PanFile)
        .createQueryBuilder()
        .where('directory = :directory', { directory: directory })
        .andWhere('status = :status', { status: 1 })
        .orderBy('type', 'ASC')
        .addOrderBy('name', 'ASC')
        .skip(skip)
        .take(num)
        .getRawMany()

      logger.info(`查询 path：${directory} 文件：`)
      const simplified = result.map((item) => ({
        id: item.PanFile_id,
        hash: item.PanFile_hash,
        type: item.PanFile_type,
        name: item.PanFile_name,
        suffix: item.PanFile_suffix,
        size: item.PanFile_size,
        status: item.PanFile_status,
        create: item.PanFile_create,
        update: item.PanFile_update,
        read: item.PanFile_read,
        download: item.PanFile_download,
        directory: item.PanFile_directory,
        path: item.PanFile_path
      }))
      console.log(simplified)
      return simplified
    } catch (err: any) {
      logger.error(`[PanFileService] 发生错误：${err.message}`)
      return false
    }
  }

  addFile = (path: string, info: []): boolean => {
    logger.info(`[PanFileService] 文件上传：\n路径：${path},数量：${info.length}`)
    info.forEach((e) => {
      const file = Object.assign(new PanFile(), JSON.parse(e))
      file.id = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 16)()
      Server.getInstance()
        .Database.manager.save(file, { entity: PanFile })
        .then(() => {
          logger.info(`[PanFile] 新增一条记录：${{ file }}`)
        })
        .catch((err: any) => {
          logger.error(`[PanFile] 插入数据错误：${err.message}`)
          return false
        })
    })
    return true
  }
}

export default PanFileServiceImpl
