import express from "express";
import fileController from "@controllers/fileController";

const router = express.Router();

router.get("/file", fileController.get);

export default router;
