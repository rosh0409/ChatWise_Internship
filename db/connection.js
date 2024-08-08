import mongoose from "mongoose";

export const connect = () =>
  mongoose
    .connect(
      `mongodb+srv://rosh0409:rosh0409@cluster0.cvohyfl.mongodb.net/ChatWise_Internship?retryWrites=true&w=majority`
    )
    .then(() => {
      console.log("db connected");
    })
    .catch((e) => {
      console.log("db not connected");
      console.log(e.message);
    });
