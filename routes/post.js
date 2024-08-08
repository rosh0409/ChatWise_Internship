import express from "express";
import { Post } from "../model/post.js";
import { User } from "../model/user.js";
import mongoose from "mongoose";

export const postRoutes = express.Router();

//! Get All Post
postRoutes.get("/all", async (req, res) => {
  try {
    const posts = await Post.find();
    return res.status(200).send({
      status: "success",
      message: "All posts list",
      posts,
    });
  } catch (error) {
    return res.status(500).send({
      status: "failed",
      message: "Something went wrong",
      error: error.message,
    });
  }
});

//! Get Post By ID
postRoutes.get("/:pid", async (req, res) => {
  try {
    console.log(req.params);
    const { pid } = req.params;
    const post = await Post.findById(pid);
    return res.status(200).send({
      status: "success",
      message: "All posts list",
      post,
    });
  } catch (error) {
    return res.status(500).send({
      status: "failed",
      message: "Something went wrong",
      error: error.message,
    });
  }
});

//! POST Request for creating new post
postRoutes.post("/create", async (req, res) => {
  try {
    const { title, desc } = req.body;
    const uid = req.uid;
    console.log("p uid :: " + uid);
    const existingUser = await User.findById(uid);
    if (!existingUser) {
      return res.status(400).json({
        status: "failed",
        message: "User does not exist",
      });
    }
    if (!(title && desc && uid)) {
      return res.status(400).json({
        status: "failed",
        message: "Please provide all fields",
      });
    }
    const post = new Post({
      title,
      desc,
      uid,
    });
    const session = await mongoose.startSession();
    session.startTransaction();
    await post.save({ session });
    existingUser.posts.push(post);
    await existingUser.save({ session });
    await session.commitTransaction();

    return res.status(200).json({
      status: "success",
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    return res.status(500).send({
      status: "failed",
      message: "Something went wrong",
      error: error.message,
    });
  }
});

//! PATCH Request for updating any field of post
postRoutes.patch("/update/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const uid = req.uid;
    // console.log(uid);
    const update = req.body;
    console.log('update:', update)
    const post = await Post.findById(pid);
    if (!post)
      return res.status(400).json({
        status: "failed",
        message: "Invailid Post ID",
      });
    const updatedPost = await Post.findOneAndUpdate(
      { _id: pid, uid: uid },
      update,
      {
        new: true,
      }
    );
    console.log(updatedPost);
    if (!updatedPost)
      return res.status(400).json({
        status: "failed",
        message: "Unauthorized access to the posts",
      });
    return res.status(200).json({
      status: "success",
      message: "Post updated successfully",
      updatedPost,
    });
  } catch (error) {
    return res.status(500).send({
      status: "failed",
      message: "Something went wrong",
      error: error.message,
    });
  }
});

//! DELETE Request for deleting post
postRoutes.delete("/delete/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const uid = req.uid;
    const isValidUserForPost = await Post.findOne({
      _id: pid,
      uid: uid,
    });
    if (!isValidUserForPost)
      return res.status(400).json({
        status: "failed",
        message: "Unauthorized access to the posts",
      });
    const post = await Post.findById(pid);
    if (!(post))
      return res.status(400).json({
        status: "failed",
        message: "Invailid Post or User",
      });
    const user = await User.updateOne({_id:uid},{$pull:{posts:pid}});
    const likedUser = post.likes;
    const commentedUser = post.comments;
    likedUser.forEach(async (uid) => {
      await User.updateOne({ _id: uid }, { $pull: { likes: pid } });
    });
    commentedUser.forEach(async (obj) => {
      await User.updateOne(
        { _id: obj.uid },
        { $pull: { comments: { pid: pid } } }
      );
    });
    const deletedPost = await Post.deleteOne({ _id: pid });
    const updateUserPost = await User.updateOne(
      { _id: post.user },
      {
        $pull: { posts: pid, likes: pid, comments: { pid: post } },
      }
    );
    return res.status(200).json({
      status: "success",
      message: "Post deleted successfully",
      deletedPost,
      updateUserPost,
      user
    });
  } catch (error) {
    return res.status(500).send({
      status: "failed",
      message: "Something went wrong",
      error: error.message,
    });
  }
});

