import { prisma } from "../config/prisma.js";
import fs from "fs/promises";

class FileController {
  async getUploadPage(req, res, next) {
    try {
      const { folderId } = req.query;

      res.render("file-new", { errors: [], oldInput: {}, folder: folderId });
    } catch (error) {
      next(error);
    }
  }

  async uploadFile(req, res, next) {
    try {
      if (!req.file || req.body.file) {
        return res.render("file-new", {
          errors: [{ msg: "No file uploaded" }],
          oldInput: {},
          folder: req.body.folderId,
        });
      }

      const fileExists = await prisma.file.findFirst({
        where: {
          folderId: req.body?.folderId || null,
          name: req.file.originalname,
        },
      });
      if (fileExists) {
        await fs.unlink(req.file.path);

        return res.render("file-new", {
          errors: [{ msg: "File already exists" }],
          oldInput: {},
          folder: req.body.folderId,
        });
      }

      const { file } = req;

      const newFile = await prisma.file.create({
        data: {
          name: file.originalname,
          path: file.path,
          size: file.size,
          mimeType: file.mimetype,
          userId: req.user.id,
          folderId: req.body?.folderId || null,
        },
      });

      res.redirect(`/file/${newFile.id}`);
    } catch (error) {
      next(error);
    }
  }

  async getFilePage(req, res, next) {
    try {
      const { id } = req.params;
      const file = await prisma.file.findUnique({
        where: { id: id },
        include: { folder: true },
      });

      if (file.userId !== req.user.id) {
        return res.redirect("/");
      }

      res.render("file", { file: file });
    } catch (error) {
      next(error);
    }
  }

  async downloadFile(req, res, next) {
    try {
      const { id } = req.params;
      const file = await prisma.file.findUnique({
        where: { id: id },
      });

      if (file.userId !== req.user.id) {
        return res.redirect("/");
      }

      res.download(file.path, file.name);
    } catch (error) {
      next(error);
    }
  }
}

export default FileController;
