import { body } from "express-validator";
import { prisma } from "../config/prisma.js";
export const createFolderValidator = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .custom(async (value, { req }) => {
      const folder = await prisma.folder.findFirst({
        where: { userId: req.user.id, name: value },
      });
      if (folder) {
        throw new Error("Folder already exists");
      }
    }),
];
