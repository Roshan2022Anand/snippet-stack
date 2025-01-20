import { ServerRoute } from "@hapi/hapi";
import {
  addComment,
  getComments,
  updateVotes,
} from "../controllers/post-utils-controlers";

const PostUtilsRoutes: ServerRoute[] = [
  //route to update the value of the vote
  {
    path: "/api/vote",
    method: "PUT",
    handler: updateVotes,
  },

  //route to add a comment
  {
    path: "/api/comment",
    method: "POST",
    handler: addComment,
  },

  //route to get all the comments
  {
    path: "/api/comment",
    method: "GET",
    handler: getComments,
  },
];

export default PostUtilsRoutes;
