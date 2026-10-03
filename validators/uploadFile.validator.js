import { body } from "express-validator";

const uploadFileValidator = [
  body("file")
    .notEmpty()
    .withMessage("File is required")
    .custom(async (value, { req }) => {
      if (!req.file) {
        throw new Error("File is required");
      }
    }),
];
export default uploadFileValidator;
