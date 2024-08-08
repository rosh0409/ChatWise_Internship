# Steps to follow while cloning and running the project

1. Clone the project `git clone https://github.com/rosh0409/ChatWise_Internship.git`

2. Execute the command `npm i` to install required dependencies

3. Excute the command `npm start` to start the project


## API
#### Base URL `http://localhost:8000`
- ##### Registration $\colorbox{green}{{\color{white}{post}}}$ `"/user/register"`

```json
{
    "username":"",
    "email":"",
    "password":"",
    "confPassword":""
}
```
- ##### Login $\colorbox{green}{{\color{white}{post}}}$ `"/user/login"`
```json
{
    "email":"",
    "password":""
}
```

- ##### User's Feed $\colorbox{blue}{{\color{white}{get}}}$ `"/user/feed"`
```json
{
    //no data
}
```
- ##### Create Post $\colorbox{green}{{\color{white}{post}}}$ `"/post/create"`
```json
{
    "title":"",
    "desc":""
}
```
- ##### Update Post $\colorbox{purple}{{\color{white}{patch}}}$ `"/post/update/:postID"`
```json
{
    "title":"",
    "desc":""
}
```
- ##### Delete Post $\colorbox{red}{{\color{white}{delete}}}$ `"/post/delete/:postID"`
```json
{
    //no data
}
```

- ##### See all friend requests $\colorbox{blue}{{\color{white}{get}}}$ `"/user/requests"`
```json
{
    //no data
}
```
- ##### Send friend request $\colorbox{green}{{\color{white}{post}}}$ `"/user/friend-request"`
```json
{
    "requestId":""
}
```

- ##### Accept/Reject friend request $\colorbox{green}{{\color{white}{post}}}$ `"/user/confirm-request"`
```json
{
    "followId":"",
    "status":"" //accept or //reject
}
```

- ##### Unfollow a friend $\colorbox{green}{{\color{white}{post}}}$ `"/user/unfollow"`
```json
{
    "unfollowId":""
}
```
- ##### Like a post $\colorbox{green}{{\color{white}{post}}}$ `"/user/like"`
```json
  {
    "pid":"" //post _id
  }
```

- ##### Comment on post $\colorbox{green}{{\color{white}{post}}}$ `"/user/comment"`
```json
{
    "pid":"", //post _id
    "comment":""
}
```