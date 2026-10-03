import { Router } from "express";
import FileController from "../controllers/file.controller.js";
import uploadFileValidator from "../validators/uploadFile.validator.js";
import upload from "../config/mutler.js";

const fileRouter = Router();
const controller = new FileController();

fileRouter.get("/new", uploadFileValidator, controller.getUploadPage);
fileRouter.post("/new", upload.single("file"), controller.uploadFile);

export default fileRouter;
