import { body } from "express-validator";
import { prisma } from "../config/prisma.js";
import bcrypt from "bcrypt";

const loginValidator = [
  body("username")
    .notEmpty()
    .withMessage("Username is required.")
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
    .custom(async (password, { req }) => {
      if (!req.user) return true;
      const match = await bcrypt.compare(password, req.user.password);
      if (!match) throw new Error("Invalid username or password.");
      return true;
    }),
];

export default loginValidator;
