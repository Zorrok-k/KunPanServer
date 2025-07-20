import { join } from "path";
import { DataSource } from "typeorm";

const DataBase = new DataSource({
  type: "better-sqlite3",
  // 需要生成的实体
  entities: [join(__dirname, '..src/server/entities/*.ts')],
  // 数据库路径
  database: "src/server/models/db/KunPanServer.db",
  // database: "./src/models/db/KunPanServer.db",
  // 自动同步表
  synchronize: true,
  logging: ["error"],
  // better-sqlite3 编译的文件 如果找不到路径要指定
//   nativeBinding: join(
//     __dirname,
//     "../node_modules/better-sqlite3/build/Release/better_sqlite3.node"
//   ),
});

export default DataBase;