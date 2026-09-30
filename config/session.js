import "dotenv/config";
import expressSession from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { prisma } from "./prisma.js";

const session = expressSession({
  cookie: {
    maxAge: 1000 * 60 * 60 * 30,
  },
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true,
  store: new PrismaSessionStore(prisma, {
    checkPeriod: 2 * 60 * 1000, //ms
    dbRecordIdIsSessionId: true,
    dbRecordIdFunction: undefined,
  }),
});

export default session;
