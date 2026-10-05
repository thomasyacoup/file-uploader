import { Router } from "express";
import FileController from "../controllers/file.controller.js";
import upload from "../config/mutler.js";

const fileRouter = Router();
const controller = new FileController();

fileRouter.get("/new", controller.getUploadPage);
fileRouter.post("/new", upload.single("file"), controller.uploadFile);

fileRouter.get("/:id", controller.getFilePage);
fileRouter.get("/:id/download", controller.downloadFile);
export default fileRouter;
