import "dotenv/config";
import express from "express";
import session from "./config/session.js";
import morgan from "morgan";
import passport from "./config/passport.js";
import authRouter from "./routers/auth.router.js";

const app = express();

app.use(session);
app.use(morgan());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");

app.use("", authRouter);

app.get("/", (req, res) => res.render("index", { req }));

app.listen(process.env.PORT, () => {
  console.log("The app is running on:", process.env.PORT);
});
