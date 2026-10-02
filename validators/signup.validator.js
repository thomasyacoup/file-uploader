import { body } from "express-validator";
import { prisma } from "../config/prisma.js";
const signupValidator = [
  body("username")
    .notEmpty()
    .withMessage("Username is required.")
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage(
      "Username can only contain characters, numbers, underscore and hyphen.",
    )
    .isLength({ max: 16, min: 3 })
    .withMessage("Username length should be between 3 and 16 characters")
    .custom(async (username) => {
      const user = await prisma.user.findFirst({
        where: { username },
      });
      if (user) throw new Error("This username is used");
    }),
  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 6 })
    .withMessage("Password length should be at least 6 characters"),
  body("confirm_password")
    .notEmpty()
    .withMessage("Confirm password is required.")
    .custom((pw, { req }) => {
      if (pw == req.body.password) return true;
      throw new Error("Passwords doesn't match");
    }),
];

export default signupValidator;
