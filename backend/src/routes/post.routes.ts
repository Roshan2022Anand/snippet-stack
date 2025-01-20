import { ServerRoute } from "@hapi/hapi";
import {
  createPost,
  deletePost,
  getAllRandomPosts,
  getAllUserPosts,
  getPost,
  updatePost,
} from "../controllers/post-controllers";

const PostRoute: ServerRoute[] = [
  //route to create a post
  {
    path: "/api/post",
    method: "POST",
    handler: createPost,
  },

  //route to get a single post
  {
    path: "/api/post",
    method: "GET",
    handler: getPost,
  },

  //route to get posts of the a user
  {
    path: "/api/alluserposts",
    method: "GET",
    handler: getAllUserPosts,
  },

  //route to get random posts
  {
    path: "/api/allposts",
    method: "GET",
    handler: getAllRandomPosts,
  },

  //route to update a post
  {
    path: "/api/post",
    method: "PUT",
    handler: updatePost,
  },

  //route to delete a post
  {
    path: "/api/post",
    method: "DELETE",
    handler: deletePost,
  },
];

export default PostRoute;
