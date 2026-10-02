import { validationResult } from "express-validator";
import { prisma } from "../config/prisma.js";
import bcrypt from "bcrypt";

class AuthController {
  async getSignupPage(req, res, next) {
    try {
      if (req.isAuthenticated()) return res.redirect("/");
      res.render("signup", { oldInput: [], errors: [] });
    } catch (e) {
      next(e);
    }
  }

  async signup(req, res, next) {
    try {
      const validationErrs = validationResult(req);
      if (!validationErrs.isEmpty()) {
        return res.render("signup", {
          errors: validationErrs.array(),
          oldInput: req.body,
        });
      }

      const { username, password } = req.body;
      const hash_pw = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: { username, password: hash_pw },
      });
      req.login(user, (e) => (e ? next(e) : res.redirect("/")));
    } catch (e) {
      next(e);
    }
  }

  async getLoginPage(req, res, next) {
    try {
      if (req.isAuthenticated()) return res.redirect("/");
      res.render("login", { oldInput: [], errors: [] });
    } catch (e) {
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      const validationErrs = validationResult(req);
      if (!validationErrs.isEmpty()) {
        return res.render("login", {
          errors: validationErrs.array(),
          oldInput: req.body,
        });
      }

      const { username, password } = req.body;

      const user = req.user;
      req.login(user, (e) => (e ? next(e) : res.redirect("/")));
    } catch (e) {
      next(e);
    }
  }
}

export default AuthController;
