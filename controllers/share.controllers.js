import { prisma } from "../config/prisma.js";

class shareController {
  async getShareLink(req, res, next) {
    try {
      const { id } = req.params;
      const shareLink = await prisma.shareLink.findFirst({
        where: { id },
        include: {
          folder: { select: { files: true, name: true, createdAt: true } },
        },
      });
      if (shareLink.expiresAt < Date.now()) {
        return res.redirect("/");
      }

      res.render("share", { folder: shareLink.folder, shareLink });
    } catch (error) {
      next(error);
    }
  }
}

export default shareController;
