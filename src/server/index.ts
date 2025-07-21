import express from 'express'
import router from './routes/index'
import Settings from '../main/settings'
import { DataSource } from 'typeorm'
import { PanFile } from './entities/PanFile'

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
  public async start(): Promise<void> {
    try {
      const serverConfig = Settings.getInstance().server

      // 初始化数据库
      this.Database = new DataSource({
        type: 'better-sqlite3',
        // 需要生成的实体
        entities: [PanFile],
        // 数据库路径
        database: Settings.getInstance().path.database,
        // 自动同步表
        synchronize: true,
        logging: ['error']
        // better-sqlite3 编译的文件 如果找不到路径要指定 nativeBinding:
      })

      this.Database.initialize()

      console.log('✅ 数据库连接成功')

      // 创建 Express 应用
      const app = express()

      // 路由中间件
      app.use('/api', router)

      // 启动服务器
      app.listen(serverConfig.port, () => {
        console.log('✅ Express 服务已启动\n')
        console.log(`主页：${serverConfig.host}:${serverConfig.port}/home`)
        console.log(`Base：${serverConfig.host}:${serverConfig.port}/api`)
      })
    } catch (error) {
      console.error('❌ 启动服务失败:', error)
      process.exit(1)
    }
  }
}
