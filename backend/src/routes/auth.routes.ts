import { ServerRoute } from "@hapi/hapi";
import {
  getAuthDetails,
  userLogin,
  userLogout,
  userSignup,
} from "../controllers/auth-controlers";

const AuthRoutes: ServerRoute[] = [
  // route to get authenticated user details
  {
    path: "/api/auth",
    method: "GET",
    handler: getAuthDetails,
  },

  // route for signing up
  {
    path: "/api/signup",
    method: "POST",
    options: {
      auth: false,
    },
    handler: userSignup,
  },

  // route for logging in
  {
    path: "/api/login",
    method: "GET",
    options: {
      auth: false,
    },
    handler: userLogin,
  },

  // route for logging out
  {
    path: "/api/logout",
    method: "GET",
    handler: userLogout,
  },
];

export default AuthRoutes;
