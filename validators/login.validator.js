import { body } from "express-validator";
import { prisma } from "../config/prisma.js";
import bcrypt from "bcrypt";

const loginValidator = [
  body("username")
    .notEmpty()
    .withMessage("Username is required.")
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage(
      "Username can only contain characters, numbers, underscore and hyphen.",
    )
    .isLength({ max: 16, min: 3 })
    .withMessage("Username length should be between 3 and 16 characters")
    .custom(async (username, { req }) => {
      const user = await prisma.user.findFirst({
        where: { username },
      });
      if (!user) throw new Error("Invalid username or password.");
      req.user = user;
    }),
  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 6 })
    .withMessage("Password length should be at least 6 characters")
    .custom(async (password, { req }) => {
      if (!req.user) return true;
      const match = await bcrypt.compare(password, req.user.password);
      if (!match) throw new Error("Invalid username or password.");
      return true;
    }),
];

export default loginValidator;
