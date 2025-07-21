import fs from 'fs/promises' // 使用 promises 版本
import { resolve } from 'path'
import logger from '../../server/utils/logger'
import { app } from 'electron'
import { server, path } from './default' // 假设你导出的是普通对象

const SETTINGS_DIR = resolve(app.getAppPath(), 'resources/settings')

export default class Settings {
  static instance: Settings

  static getInstance() {
    if (!this.instance) {
      this.instance = new Settings()
    }
    return this.instance
  }

  // 读取的设置信息
  server: any
  path: any

  init = async (): Promise<void> => {
    try {
      // 确保配置目录存在
      await fs.mkdir(SETTINGS_DIR, { recursive: true })
      logger.info(`[Setting] 创建配置目录：${SETTINGS_DIR}`)

      const serverPath = resolve(SETTINGS_DIR, 'server.json')
      const pathPath = resolve(SETTINGS_DIR, 'path.json')

      // 检查 server.json 是否存在，不存在则写入默认值
      try {
        await fs.access(serverPath)
      } catch {
        await fs.writeFile(serverPath, JSON.stringify(server, null, 2), 'utf-8')
        logger.info(`[Setting] 创建：${serverPath}`)
      }

      // 检查 path.json 是否存在，不存在则写入默认值
      try {
        await fs.access(pathPath)
      } catch {
        await fs.writeFile(pathPath, JSON.stringify(path, null, 2), 'utf-8')
        logger.info(`[Setting] 创建：${pathPath}`)
      }

      // ✅ 直接读取 JSON 文件内容并解析为对象
      const serverData = await fs.readFile(serverPath, 'utf-8')
      this.server = JSON.parse(serverData)

      const pathData = await fs.readFile(pathPath, 'utf-8')
      this.path = JSON.parse(pathData)

      logger.info('[Setting] 配置加载完成')
    } catch (err: any) {
      logger.error(`[Setting] 初始化错误：${err.message}`)
      throw err
    }
  }
}
