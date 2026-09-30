import "dotenv/config";
import express from "express";

const app = express();

app.listen(process.env.PORT, () => {
  console.log("The app is running on:", process.env.PORT);
});
