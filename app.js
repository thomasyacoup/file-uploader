import "dotenv/config";
import express from "express";
import session from "./config/session";
import morgan from "morgan";
import passport from "./config/passport";

const app = express();

app.use(session);
app.use(morgan());
app.use(passport.initialize());
app.use(passport.session());
app.set("view engine", "ejs");

app.listen(process.env.PORT, () => {
  console.log("The app is running on:", process.env.PORT);
});
