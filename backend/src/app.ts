import { Request, ResponseToolkit } from "@hapi/hapi";
import testDbConnection from "./tests/connectDbTest";
import pool from "./db/dbConfig";
import PostUtilsRoutes from "./routes/postUtils.routes";
import UserRoutes from "./routes/user.routes";
import AuthRoutes from "./routes/auth.routes";
import PostRoute from "./routes/post.routes";

const Cookie = require("@hapi/cookie");
const Hapi = require("@hapi/hapi");

const init = async () => {
  // Defining the server configuration with CORS
  const server = Hapi.server({
    port: process.env.PORT || 5000,
    host: "0.0.0.0",
    routes: {
      cors: {
        origin: [process.env.FRONTEND_URL],
        credentials: true,
      },
    },
  });

  // Register the bell strategy
  await server.register(Cookie);

  // Register the cookie auth strategy
  server.auth.strategy("session", "cookie", {
    cookie: {
      name: "session",
      password: "!wsYhFA*C2U6nz=Bu^X2@2beCem8kSR6",
      isSecure: process.env.NODE_ENV === "production",
      ttl: 64 * 60 * 60 * 1000,
      path: "/",
      isSameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      isHttpOnly: true,
    },
    // @ts-ignore
    validate: async (request, session) => {
      const email = session.email;
      const { rows } = await pool.query(
        `SELECT * FROM users u WHERE u.email = $1`,
        [email]
      );
      if (rows[0]) {
        return { isValid: true, credentials: rows[0] };
      }
      return {
        isValid: false,
      };
    },
  });
  server.auth.default("session");

  await testDbConnection();

  //entry point to check if server is running
  server.route({
    path: "/",
    method: "GET",
    options: {
      auth: false,
    },
    handler: async () => {
      return "Server is Running"
    },
  });

  // Register the routes
  server.route(UserRoutes);
  server.route(AuthRoutes);
  server.route(PostRoute);
  server.route(PostUtilsRoutes);

  await server.start();
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
