import { app } from 'electron'
import { resolve } from 'path'
import { PanFile } from '../entities/PanFile'
import { DataSource } from 'typeorm'

const dataPath = app.getPath('userData')

const DataBase = new DataSource({
  type: 'better-sqlite3',
  // 需要生成的实体
  entities: [PanFile],
  // 数据库路径
  database: resolve(dataPath, 'db/KunPanServer.db'),
  // 自动同步表
  synchronize: true,
  logging: ['error']
  // better-sqlite3 编译的文件 如果找不到路径要指定 nativeBinding:
})

export default DataBase
