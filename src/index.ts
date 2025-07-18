import "module-alias/register";
import express from "express";
import router from "@routers/index";

const app = express();

// 路由中间件
app.use("/api", router);

app.listen(8100, () => {
  console.log("===============Express 服务已启动===============\n");
  console.log("主页：http://localhost:8100/home");
  console.log("BaseUrl：http://localhost:8100/api\n");
  console.log("================================================");
});
