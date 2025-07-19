import "module-alias/register";
import express from "express";
import router from "@routers/index";
import DataBase from "@models/index";

// 初始化数据库
DataBase.initialize()
  .then(() => {
    console.log("✅ 数据库连接成功");

    // 创建 Express 应用
    const app = express();

    // 路由中间件
    app.use("/api", router);

    // 启动服务器
    app.listen(8100, () => {
      console.log("✅ Express 服务已启动\n");
      console.log("主页：http://localhost:8100/home");
      console.log("Base：http://localhost:8100/api\n");
    });
  })
  .catch((error) => {
    console.error("❌ 数据库连接失败:", error);
    process.exit(1); // 如果数据库连接失败，直接退出进程
  });
