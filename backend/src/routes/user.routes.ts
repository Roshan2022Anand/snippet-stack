import { ServerRoute } from "@hapi/hapi";

const userRoutes: ServerRoute[] = [
  { path: "/api/user", method: "GET", handler: async (request, h) => {} },
  { path: "/api/user", method: "POST", handler: async (request, h) => {} },
];

export default userRoutes;