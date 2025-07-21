import { app } from 'electron'
import { resolve } from 'path'

const RESOURCES = resolve(app.getAppPath(), 'resources')

//  express 服务默认配置
export const server = {
  host: 'http://127.0.0.1',
  port: 8100,
  root: 'D:'
}

// 默认路径
export const path = {
  database: resolve(RESOURCES, 'db/KunPanServer.db'),
  log: resolve(RESOURCES, 'logs')
}
