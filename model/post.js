import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    desc: {
      type: String,
      require: true,
    },
    likes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "user",
        default: [],
      },
    ],
    comments: [
      {
        uid: {
          type: mongoose.Types.ObjectId,
          require: true,
          ref: "user",
        },
        comment: {
          type: String,
          require: true,
        },
        date: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    uid: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Post = mongoose.model("post", postSchema);
