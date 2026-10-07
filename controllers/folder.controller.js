import { validationResult } from "express-validator";
import { prisma } from "../config/prisma.js";

class FolderController {
  async getCreateFolderPage(req, res, next) {
    try {
      res.render("folder-new", { errors: [], oldInput: {} });
    } catch (error) {
      next(error);
    }
  }

  async createNewFolder(req, res, next) {
    try {
      const validationErr = validationResult(req);
      if (!validationErr.isEmpty()) {
        return res.render("folder-new", {
          errors: validationErr.array(),
          oldInput: req.body,
        });
      }

      const { name } = req.body;

      const folder = await prisma.folder.create({
        data: { name, userId: req.user.id },
      });
      res.redirect(`/folder/${folder.id}`);
    } catch (error) {
      next(error);
    }
  }

  async getFolder(req, res, next) {
    try {
      const { id } = req.params;
      const folder = await prisma.folder.findUnique({
        where: { id: id },
        include: { files: true, shareLinks: true },
      });

      if (folder.userId !== req.user.id) {
        return res.redirect("/");
      }

      res.render("folder", { folder: folder, req });
    } catch (error) {
      next(error);
    }
  }

  async shareFolder(req, res, next) {
    try {
      const { id } = req.params;

      const folder = await prisma.folder.findUnique({
        where: { id: id },
      });

      if (folder.userId !== req.user.id) {
        return res.redirect("/");
      }

      await prisma.shareLink.create({
        data: {
          folderId: id,
          userId: req.user.id,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });

      res.redirect(`/folder/${id}`);
    } catch (error) {
      next(error);
    }
  }
}

export default FolderController;
