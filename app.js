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

const html = `<h1>Steps to follow while cloning and running the project</h1>
<ol>
<li><p>Clone the project <code>git clone https://github.com/rosh0409/ChatWise_Internship.git</code></p></li>
<li><p>Execute the command <code>npm i</code> to install required dependencies</p></li>
<li><p>Excute the command <code>npm start</code> to start the project</p></li>
</ol>
<h2>API</h2>
<h4>Base URL <code>http://localhost:8000</code></h4>
<ul>
<li>##### Registration <mark>post</mark> <code>"/user/register"</code></li>
</ul>
<pre><code>{
    "username":"",
    "email":"",
    "password":"",
    "confPassword":""
}
</code></pre>
<ul>
<li>##### Login <mark>post</mark> <code>"/user/login"</code></li>
</ul>
<pre><code>{
    "email":"",
    "password":""
}
</code></pre>
<ul>
<li>##### User's Feed <mark>get</mark> <code>"/user/feed"</code></li>
</ul>
<pre><code>{
    //no data
}
</code></pre>
<ul>
<li>##### Create Post <mark>post</mark> <code>"/post/create"</code></li>
</ul>
<pre><code>{
    "title":"",
    "desc":""
}
</code></pre>
<ul>
<li>##### Update Post <mark>patch</mark> <code>"/post/update/:postID"</code></li>
</ul>
<pre><code>{
    "title":"",
    "desc":""
}
</code></pre>
<ul>
<li>##### Delete Post <mark>delete</mark> <code>"/post/delete/:postID"</code></li>
</ul>
<pre><code>{
    //no data
}
</code></pre>
<ul>
<li>##### See all friend requests <mark>get</mark> <code>"/user/requests"</code></li>
</ul>
<pre><code>{
    //no data
}
</code></pre>
<ul>
<li>##### Send friend request <mark>post</mark> <code>"/user/friend-request"</code></li>
</ul>
<pre><code>{
    "requestId":""
}
</code></pre>
<ul>
<li>##### Accept/Reject friend request <mark>post</mark> <code>"/user/confirm-request"</code></li>
</ul>
<pre><code>{
    "followId":"",
    "status":"" //accept or //reject
}
</code></pre>
<ul>
<li>##### Unfollow a friend <mark>post</mark> <code>"/user/unfollow"</code></li>
</ul>
<pre><code>{
    "unfollowId":""
}
</code></pre>
<ul>
<li>##### Like a post <mark>post</mark> <code>"/user/like"</code></li>
</ul>
<pre><code>  {
    "pid":"" //post _id
  }
</code></pre>
<ul>
<li>##### Comment on post <mark>post</mark> <code>"/user/comment"</code></li>
</ul>
<pre><code>{
    "pid":"", //post _id
    "comment":""
}
</code></pre>
<ul>
<li>##### Get all the registered user <mark>get</mark> <code>"/user/all"</code></li>
</ul>
<pre><code>{
    //no data
}
</code></pre>
<ul>
<li>##### Logout the user <mark>get</mark> <code>"/user/logout"</code></li>
</ul>
<pre><code>{
    //no data
}
</code></pre>
<ul>
<li>##### Change the forgot password <mark>post</mark> <code>"/user/forgot-password"</code></li>
</ul>
<pre><code>{
    "email":""
}
</code></pre>
<ul>
<li>##### Reset the password <mark>post</mark> <code>"/user/reset-password/:token"</code></li>
</ul>
<pre><code>{
    "newPassword":"",
    "confPassword":""
}
</code></pre>
<ul>
<li>##### Get all the post of user <mark>get</mark> <code>"/post/all"</code></li>
</ul>
<pre><code>{
    //no data
}
</code></pre>
<ul>
<li>##### Get a post of user by postID <mark>get</mark> <code>"/:postID"</code></li>
</ul>
<pre><code>{
    //no data
}
</code></pre>`;
app.get("/", (req, res) => {
  res.send(html);
});
app.use("/user", userRoutes);
app.use("/post", verifyUserToken, postRoutes);

app.listen(8000, async (err) => {
  if (err) return err.message;
  await connect();
  console.log(`server started... \nhttp://localhost:8000`);
});
