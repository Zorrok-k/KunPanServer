import fs from 'fs'
import { resolve } from 'path'
import logger from '../../server/utils/logger'
import { app } from 'electron'
import { server, path } from './default' // 假设你导出的是普通对象

const SETTINGS_DIR = resolve(app.getAppPath(), 'resources/settings')

const pathArry = [
  {
    path: resolve(SETTINGS_DIR, 'server.json'),
    json: server
  },
  {
    path: resolve(SETTINGS_DIR, 'path.json'),
    json: path
  }
]

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

  init = async () => {
    try {
      if (!fs.existsSync(SETTINGS_DIR)) {
        fs.mkdirSync(SETTINGS_DIR, { recursive: true })
        logger.info(`[Setting] 创建配置目录：${SETTINGS_DIR}`)
      }

      pathArry.forEach((e) => {
        if (!fs.existsSync(e.path)) {
          fs.writeFileSync(e.path, JSON.stringify(e.json, null, 2), 'utf-8')
          logger.info(`[Setting] 创建：${e.path}`)
        }
      })

      this.server = JSON.parse(fs.readFileSync(resolve(SETTINGS_DIR, 'server.json'), 'utf-8'))
      this.path = JSON.parse(fs.readFileSync(resolve(SETTINGS_DIR, 'path.json'), 'utf-8'))

      logger.info('[Setting] 配置加载完成')
    } catch (err: any) {
      logger.error(`[Setting] 初始化错误：${err.message}`)
    }
  }
}
