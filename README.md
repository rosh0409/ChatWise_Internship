# Steps to follow while cloning and running the project

1. Clone the project `git clone https://github.com/rosh0409/ChatWise_Internship.git`

2. Execute the command `npm i` to install required dependencies

3. Excute the command `npm start` to start the project


## API
#### Base URL `http://localhost:8000`
- ##### Registration <mark style="background-color:green; padding:4px">post</mark> `"/user/register"`

```json
{
    "username":"",
    "email":"",
    "password":"",
    "confPassword":""
}
```
- ##### Login <mark style="background-color:green; padding:4px">post</mark> `"/user/login"`
```json
{
    "email":"",
    "password":""
}
```

- ##### User's Feed <mark style="background-color:blue; padding:4px">get</mark> `"/user/feed"`
```json
{
    //no data
}
```
- ##### Create Post <mark style="background-color:green; padding:4px">post</mark> `"/post/create"`
```json
{
    "title":"",
    "desc":""
}
```
- ##### Update Post <mark style="background-color:purple; padding:4px">patch</mark> `"/post/update/:postID"`
```json
{
    "title":"",
    "desc":""
}
```
- ##### Delete Post <mark style="background-color:red; padding:4px">delete</mark> `"/post/delete/:postID"`
```json
{
    //no data
}
```

- ##### See all friend requests <mark style="background-color:blue; padding:4px">get</mark> `"/user/requests"`
```json
{
    //no data
}
```
- ##### Send friend request <mark style="background-color:green; padding:4px">post</mark> `"/user/friend-request"`
```json
{
    "requestId":""
}
```

- ##### Accept/Reject friend request <mark style="background-color:green; padding:4px">post</mark> `"/user/confirm-request"`
```json
{
    "followId":"",
    "status":"" //accept or //reject
}
```

- ##### Unfollow a friend <mark style="background-color:green; padding:4px">post</mark> `"/user/unfollow"`
```json
{
    "unfollowId":""
}
```
- ##### Like a post <mark style="background-color:green; padding:4px">post</mark> `"/user/like"`
```json
  {
    "pid":"" //post _id
  }
```

- ##### Comment on post <mark style="background-color:green; padding:4px">post</mark> `"/user/comment"`
```json
{
    "pid":"", //post _id
    "comment":""
}
```