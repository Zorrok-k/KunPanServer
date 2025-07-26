import express from 'express'
import router from './routes/index'
import Settings from '../main/settings'
import { DataSource } from 'typeorm'
import PanFile from './entities/PanFile'
import logger from './utils/logger'
import cors from 'cors'
import os from 'os'
import path from 'path'

export default class Server {
  Database: any
  // 私有静态实例
  static instance: Server

  // 私有构造函数
  constructor() {
    // 构造函数中不再访问 Settings
  }

  // 获取单例实例
  static getInstance(): Server {
    if (!Server.instance) {
      Server.instance = new Server()
    }
    return Server.instance
  }

  // 初始化配置并启动服务
  start = () => {
    // 创建 Express 应用
    const app = express()

    try {
      // 初始化数据库
      this.Database = new DataSource({
        type: 'better-sqlite3',
        entities: [PanFile],
        database: Settings.getInstance().path.database,
        synchronize: true
      })

      this.Database.initialize()
        .then(() => {
          console.log('\n✅ 数据库连接成功')
          // 启动服务器
          const serverConfig = Settings.getInstance().server

          const IPv4 = getLocalIPAddress()

          // 跨域中间件
          app.use(
            cors({
              origin: ['http://localhost:5272', 'http://192.168.31.229:5272']
            })
          )

          // 设置静态资源目录
          app.use(express.static('resources/web'))

          app.get('/', (_req, res) => {
            
            res.sendFile(path.join(__dirname, '../resources/web/index.html'))
          })

          // 路由中间件
          app.use('/api', router)

          app.listen(serverConfig.port, () => {
            console.log('✅ Express 服务已启动')
            console.log(`主页：${IPv4}:${serverConfig.port}/home`)
            console.log(`Base：${IPv4}:${serverConfig.port}/api\n`)
          })
        })
        .catch((err: any) => {
          logger.error('❌ 数据库连接失败:', err)
          process.exit(1)
        })
    } catch (err) {
      logger.error('❌ 启动服务失败:', err)
      process.exit(1)
    }
  }
}

// 获取本机IP地址的通用函数
function getLocalIPAddress(): string | undefined {
  const interfaces = os.networkInterfaces()
  for (const name of Object.keys(interfaces)) {
    const nets = interfaces[name]
    if (!nets) continue
    for (const net of nets) {
      if (!net.internal && net.family === 'IPv4') {
        return net.address
      }
    }
  }
  return undefined
}
