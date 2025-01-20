import { ServerRoute } from "@hapi/hapi";
import {
  deleteUser,
  getUser,
  updateUser,
} from "../controllers/user-controlers";

//Routes for all User operations
const UserRoutes: ServerRoute[] = [
  //API endpoint to get the user details
  {
    path: "/api/user",
    method: "GET",
    handler: getUser,
  },

  //API endpoint to update the user details
  {
    path: "/api/user",
    method: "PUT",
    handler: updateUser,
  },

  //API endpoint to delete the user
  {
    path: "/api/user",
    method: "DELETE",
    handler: deleteUser,
  },
];

export default UserRoutes;
