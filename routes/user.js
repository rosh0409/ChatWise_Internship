import express, { json } from "express";
import { User } from "../model/user.js";
import emailValidator from "deep-email-validator";
import verifyUserToken from "../middleware/verifyUserToken.js";
import bcryptjs from "bcryptjs";
import { generateAuthToken } from "../utils/generateAuthToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import { Post } from "../model/post.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

export const userRoutes = express.Router();

//! GET Request for getting all user
userRoutes.get("/all", verifyUserToken, async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).send({
      status: "success",
      message: "All users list",
      users,
    });
  } catch (error) {
    return res.status(500).send({
      status: "failed",
      message: "Something went wrong",
      error: error.message,
    });
  }
});

//! POST Request for registering new user
userRoutes.post("/register", async (req, res) => {
  const { username, email, password, confPassword } = req.body;
  const isValidEmail = await emailValidator.validate(email);
  if (!(username && email && password && confPassword))
    return res.status(201).json({
      status: "failed",
      message: "Please fill all the fields",
    });

  if (!isValidEmail.valid)
    return res.status(201).json({
      status: "failed",
      message: "Please enter a valid email id",
    });

  if (password !== confPassword)
    return res.status(201).json({
      status: "failed",
      message: "Password and Confirm Password does not match",
    });
  try {
    if (await User.findOne({ email })) {
      return res.status(201).json({
        status: "failed",
        message: "User already exists",
      });
    }

    const user = new User({
      username,
      email,
      password,
    });
    user.save();
    res.status(201).json({
      status: "success",
      message: "User successfully registered",
    });
  } catch (error) {}
});

//! POST Request for Logging user
userRoutes.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!(email && password))
    return res.status(201).json({
      status: "failed",
      message: "Please fill all the fields",
    });
  const user = await User.findOne({ email });
  if (!user)
    return res.status(201).json({
      status: "failed",
      message: "Bad Credentials",
    });
  const dePassword = await bcryptjs.compare(password, user.password);
  if (!(user.email && dePassword))
    return res.status(201).json({
      status: "failed",
      message: "Bad Credentials",
    });
  const token = generateAuthToken(user._id, "24h");
  if (req.headers?.cookie?.split("=")[1]) {
    return res
      .cookie("internship", token, {
        path: "/",
        expires: new Date(Date.now() + 86400000),
        httpOnly: true,
        sameSite: "strict",
      })
      .status(201)
      .json({
        status: "success",
        message: "User Loggedin successfully",
      })
      .end();
  }
  return res
    .cookie("internship", token, {
      path: "/",
      expires: new Date(Date.now() + 86400000),
      httpOnly: true,
      sameSite: "strict",
    })
    .status(201)
    .json({
      status: "success",
      message: "User Loggedin successfully",
    })
    .end();
});

//! POST Request for forgot password
userRoutes.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email)
    return res.status(201).json({
      status: "failed",
      message: "Please fill all the fields",
    });
  const user = await User.findOne({ email });
  if (!user)
    return res.status(201).json({
      status: "failed",
      message: "Bad Credentials",
    });
  const token = generateAuthToken(user._id);
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 900000; // 15m
  await user.save();
  console.log(user._id);
  sendEmail(
    process.env.SENDEREMAIL,
    process.env.SENDERPASSWORD,
    email,
    "Reset Password",
    `To reset your password, click on the following link: http://localhost:8000/user/reset-password/${token}`
  );
  return res.status(201).json({
    status: "success",
    message: "Reset password link has been sent to your registered email id",
    token,
  });
});

//! POST Request for reseting password
userRoutes.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword, confPassword } = req.body;
    if (newPassword !== confPassword)
      return res.status(201).json({
        status: "failed",
        message: "Password and Confirm Password does not match",
      });
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ status: "failed", message: "Invalid or expired token" });
    }
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res
      .status(200)
      .json({ status: "success", message: "Password reset successful" });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "failed", message: "Internal server error" });
  }
});

//!POST Request for logging out a user
userRoutes.post("/logout", verifyUserToken, async (req, res) => {
  try {
    const token = req.headers?.cookie.split("=")[1];
    if (!token) {
      return res.status(400).json({
        status: "failed",
        message: "Token not found",
      });
    }
    jwt.verify(token, process.env.JWTSECRETKEY, (err) => {
      if (err) {
        return res.status(400).json({
          status: "failed",
          message: "Invalid Token",
          error: err.message,
        });
      }
      return res
        .clearCookie("internship")
        .status(200)
        .json({
          status: "success",
          message: "Successfully Logged Out :-)",
        })
        .end();
    });
  } catch (error) {
    return res.status(500).send({
      status: "failed",
      message: "Something went wrong",
      error: error.message,
    });
  }
});

//! POST Request for sending friend request
userRoutes.get("/requests", verifyUserToken, async (req, res) => {
  try {
    const uid = req.uid;
    const existingUser = await User.findById(uid);
    if (!existingUser)
      return res.status(400).json({
        status: "failed",
        message: "Invaild User ID",
      });
    const requests = await User.find({ _id: uid });
    return res.status(200).json({
      status: "success",
      message: "All Friend Requests",
      requests,
    });
  } catch (error) {
    return res.status(500).send({
      status: "failed",
      message: "Something went wrong",
      error: error.message,
    });
  }
});

//! POST Request for sending friend request
userRoutes.post("/friend-request", verifyUserToken, async (req, res) => {
  try {
    const uid = req.uid;
    const { requestId } = req.body;
    const existingUser = await User.findById(uid);
    if (!existingUser)
      return res.status(400).json({
        status: "failed",
        message: "Invaild User ID",
      });
    const existingRequestId = await User.findById(requestId);
    if (!existingRequestId)
      return res.status(400).json({
        status: "failed",
        message: "Invaild Request ID",
      });
    const wasSent = await User.find({ _id: requestId, requests: uid });
    if (wasSent.length !== 0)
      return res.status(201).json({
        status: "failed",
        message: "Request Already Sent",
      });
    const requestUser = await User.findByIdAndUpdate(
      requestId,
      {
        $push: { requests: uid },
      },
      { new: true }
    );
    return res.status(200).json({
      status: "success",
      message: "Friend Request Sent",
      requestUser,
    });
  } catch (error) {
    return res.status(500).send({
      status: "failed",
      message: "Something went wrong",
      error: error.message,
    });
  }
});

//! POST Request for follwing a user
userRoutes.post("/confirm-request", verifyUserToken, async (req, res) => {
  try {
    const uid = req.uid;
    const { followId, status } = req.body;
    if (!(uid && followId && status))
      return res.status(400).json({
        status: "failed",
        message: "Please fill all fields",
      });
    if (status != "accept" || status != "reject") {
      return res.json({
        status: "failed",
        message:
          "Please provide the valid calue for status ('accpect' or 'reject')",
      });
    }
    const existingUser = await User.findById(uid);
    if (!existingUser)
      return res.status(400).json({
        status: "failed",
        message: "Invaild User ID",
      });
    const existingFollowId = await User.findById(followId);
    if (!existingFollowId)
      return res.status(400).json({
        status: "failed",
        message: "Invaild Follow ID",
      });
    const requestStatus = await User.findByIdAndUpdate(uid, {
      $pull: { requests: followId },
    });
    if (status == "reject") {
      return res.status(200).json({
        status: "success",
        message: "Friend Request Rejected",
        requestStatus,
      });
    }
    const followingUser = await User.findByIdAndUpdate(
      uid,
      {
        $push: { followers: followId },
      },
      { new: true }
    );
    const followedUser = await User.findByIdAndUpdate(
      followId,
      {
        $push: { following: uid },
      },
      { new: true }
    );
    return res.status(200).json({
      status: "success",
      message: "User followed",
      followingUser,
      followedUser,
      requestStatus,
    });
  } catch (error) {
    return res.status(500).send({
      status: "failed",
      message: "Something went wrong",
      error: error.message,
    });
  }
});

//! POST Request for unfollwing a user
userRoutes.post("/unfollow", verifyUserToken, async (req, res) => {
  try {
    const uid = req.uid;
    const { unfollowId } = req.body;
    if (!(uid && unfollowId))
      return res.status(400).json({
        status: "failed",
        message: "Please fill all fields",
      });
    const existingUser = await User.findById(uid);
    if (!existingUser)
      return res.status(400).json({
        status: "failed",
        message: "Invaild User ID",
      });
    const existingFollowId = await User.findById(unfollowId);
    if (!existingFollowId)
      return res.status(400).json({
        status: "failed",
        message: "Invaild Follow ID",
      });
    const wasFollowed = await User.find({ _id: uid, following: unfollowId });
    if (wasFollowed.length == 0)
      return res.status(201).json({
        status: "failed",
        message: "User is already not followed",
      });
    const followingUser = await User.findByIdAndUpdate(
      uid,
      {
        $pull: { following: unfollowId },
      },
      { new: true }
    );
    const followedUser = await User.findByIdAndUpdate(
      unfollowId,
      {
        $pull: { followers: uid },
      },
      { new: true }
    );
    return res.status(200).json({
      status: "success",
      message: "User Unfollowed",
      followingUser,
      followedUser,
    });
  } catch (error) {
    return res.status(500).send({
      status: "failed",
      message: "Something went wrong",
      error: error.message,
    });
  }
});

//! POST Request for liking a post
userRoutes.post("/like", verifyUserToken, async (req, res) => {
  try {
    const uid = req.uid;
    const { pid } = req.body;
    if (!(uid && pid))
      return res.status(400).json({
        status: "failed",
        message: "Please fill all fields",
      });
    const existingUser = await User.findById(uid);
    if (!existingUser)
      return res.status(400).json({
        status: "failed",
        message: "Invaild User ID",
      });
    const existingPost = await Post.findById(pid);
    if (!existingPost)
      return res.status(400).json({
        status: "failed",
        message: "Invaild Post ID",
      });
    const isLikedPost = await User.find({ _id: uid, likes: pid });
    if (isLikedPost.length !== 0)
      return res.status(201).json({
        status: "failed",
        message: "Already liked",
      });
    const isLikedByUser = await Post.find({ _id: pid, likes: uid });
    if (isLikedByUser.length !== 0)
      return res.status(201).json({
        status: "failed",
        message: "Already liked",
      });
    await Post.findByIdAndUpdate(pid, {
      $addToSet: { likes: uid },
    });
    await User.findByIdAndUpdate(uid, {
      $addToSet: { likes: pid },
    });
    const updatedPost = await Post.findById(pid);
    const updatedUser = await User.findById(uid);
    return res.status(200).json({
      status: "success",
      message: "Post Liked",
      updatedPost,
      updatedUser,
    });
  } catch (error) {
    return res.status(500).send({
      status: "failed",
      message: "Something went wrong",
      error: error.message,
    });
  }
});

//! POST Request for posting comment on a post
userRoutes.post("/comment", verifyUserToken, async (req, res) => {
  try {
    const { pid, comment } = req.body;
    const uid = req.uid;
    if (!(uid && pid && comment))
      return res.status(400).json({
        status: "failed",
        message: "Please fill all fields",
      });

    const existingUser = await User.findById(uid);
    if (!existingUser)
      return res.status(400).json({
        status: "failed",
        message: "Invaild User ID",
      });
    const existingPost = await Post.findById(pid);
    if (!existingPost)
      return res.status(400).json({
        status: "failed",
        message: "Invaild Post ID",
      });
    const session = await mongoose.startSession();
    session.startTransaction();
    existingPost.comments.push({ uid: uid, comment: comment });
    await existingPost.save({ session });
    existingUser.comments.push({ pid: pid, comment: comment });
    await existingUser.save({ session });
    await session.commitTransaction();
    const commentedPost = await Post.findById(pid);
    const commentedUser = await User.findById(uid);
    return res.status(200).json({
      status: "success",
      message: "Comment posted successfully",
      commentedPost,
      commentedUser,
    });
  } catch (error) {
    return res.status(500).send({
      status: "failed",
      message: "Something went wrong",
      error: error.message,
    });
  }
});

//! POST Request for user's feed
userRoutes.get("/feed", verifyUserToken, async (req, res) => {
  try {
    const { uid } = req;
    const user = await User.findById(uid);
    const friend = user.following;
    var feedList = [];
    var unique = {};
    for (var i = 0; i < friend.length; i++) {
      const u = await User.findById(friend[i]);
      console.log(u.posts);
      feedList = feedList.concat(u.posts);
      feedList = feedList.concat(u.likes);
      for (let j = 0; j < u.comments.length; j++) {
        feedList.push(u.comments[i].pid);
      }
    }
    var feed = [];
    for (var i = 0; i < feedList.length; i++) {
      feed.push(await Post.findById(feedList[i]));
    }
    feed = [...new Set(feed)];
    return res.json({
      status: "success",
      message: "Your friends posted and commented on these posts",
      friend,
      feed,
    });
  } catch (error) {
    return res.status(500).send({
      status: "failed",
      message: "Something went wrong",
      error: error.message,
    });
  }
});
