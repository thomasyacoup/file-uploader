import { Strategy } from "passport-local";
import passport from "passport";
import { prisma } from "./prisma.js";
import bcrypt from "bcrypt";

const localStrategy = new Strategy(async (username, password, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });
    if (!user) return done(null, false, { message: "Invalid credentials." });

    const crctPw = await bcrypt.compare(password, user.password);
    if (!crctPw) return done(null, false, { message: "Invalid credentials." });

    return done(null, user);
  } catch (e) {
    done(e);
  }
});

passport.use(localStrategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) return done(null, false);

    done(null, user);
  } catch (e) {
    done(e);
  }
});

export default passport;
