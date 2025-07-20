import express from 'express'
import router from './routes/index'
import DataBase from './models/index'

class server {
  baseUrl: string = 'http://127.0.0.1'
  port: number = 8100

  init = () => {
    // 初始化数据库
    DataBase.initialize()
      .then(() => {
        console.log('✅ 数据库连接成功')

        // 创建 Express 应用
        const app = express()

        // 路由中间件
        app.use('/api', router)

        // 启动服务器
        app.listen(this.port, () => {
          console.log('✅ Express 服务已启动\n')
          console.log(`主页：${this.baseUrl}:${this.port}/home`)
          console.log(`Base：${this.baseUrl}:${this.port}/api`)
        })
      })
      .catch((error) => {
        console.error('❌ 数据库连接失败:', error)
        process.exit(1) // 如果数据库连接失败，直接退出进程
      })
  }

  set = (baseUrl?: string, port?: number) => {
    if (baseUrl) {
      this.baseUrl = baseUrl
    }
    if (port) {
      this.port = port
    }
  }
}

export default new server()
