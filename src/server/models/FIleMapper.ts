import { app } from 'electron'
import { resolve } from 'path'
import { DataSource } from 'typeorm'

const dataPath = app.getPath('userData')

const FileMapper = new DataSource({
  type: 'better-sqlite3',
  database: resolve(dataPath, 'db/KunPanServer.db')
})

export default FileMapper
