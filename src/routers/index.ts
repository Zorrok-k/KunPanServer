import express from "express";
import fileController from "@controllers/fileController";

const router = express.Router();

router.get("/file/build", fileController.build);

export default router;
