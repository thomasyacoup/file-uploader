import { Router } from "express";
import FolderController from "../controllers/folder.controller.js";
import { createFolderValidator } from "../validators/createFolder.validator.js";

const folderRouter = Router();

const controller = new FolderController();

folderRouter.get("/new", controller.getCreateFolderPage);
folderRouter.post("/new", createFolderValidator, controller.createNewFolder);

folderRouter.get("/:id", controller.getFolder);

export default folderRouter;
