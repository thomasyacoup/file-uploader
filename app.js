import "dotenv/config";
import express from "express";
import session from "./config/session.js";
import morgan from "morgan";
import passport from "./config/passport.js";
import authRouter from "./routers/auth.router.js";
import fileRouter from "./routers/file.router.js";
import protectedRoute from "./middleware/protectedRoute.js";
import folderRouter from "./routers/folder.router.js";
import { prisma } from "./config/prisma.js";

const app = express();

app.use(session);
app.use(morgan());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");

app.use("", authRouter);
app.use("/file", protectedRoute, fileRouter);
app.use("/folder", protectedRoute, folderRouter);

app.get("/", async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      [req.user.folders, req.user.files] = await Promise.all([
        prisma.folder.findMany({ where: { userId: req.user.id } }),
        prisma.file.findMany({ where: { userId: req.user.id, folder: null } }),
      ]);
    }
    res.render("index", { req });
  } catch (error) {
    next(error);
  }
});

app.listen(process.env.PORT, () => {
  console.log("The app is running on:", process.env.PORT);
});
