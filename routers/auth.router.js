import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";
import signupValidator from "../validators/signup.validator.js";

const authRouter = Router();
const controller = new AuthController();

authRouter.get("/signup", controller.getSignupPage);
authRouter.post("/signup", signupValidator, controller.signup);

export default authRouter;
