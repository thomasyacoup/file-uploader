import { prisma } from "../config/prisma.js";

class FileController {
  async getUploadPage(req, res, next) {
    try {
      res.render("file-new", { errors: [], oldInput: {}, folder: null });
    } catch (error) {
      next(error);
    }
  }

  async uploadFile(req, res, next) {
    try {
      const { file } = req;

      const newFile = await prisma.file.create({
        data: {
          name: file.originalname,
          path: file.path,
          size: file.size,
          mimeType: file.mimetype,
          userId: req.user.id,
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
      });

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

      res.download(file.path, file.name);
    } catch (error) {
      next(error);
    }
  }
}

export default FileController;
