import { connect } from "./db/connection.js";
import express from "express";
import { userRoutes } from "./routes/user.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { postRoutes } from "./routes/post.js";
import verifyUserToken from "./middleware/verifyUserToken.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/user", userRoutes);
app.use("/post",verifyUserToken, postRoutes);

app.listen(8000, async (err) => {
  if (err) return err.message;
  await connect();
  console.log(`server started... \nhttp://localhost:8000`);
});
