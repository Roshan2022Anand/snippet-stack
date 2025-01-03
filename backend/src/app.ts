import { Request, ResponseToolkit } from "@hapi/hapi";
import testDbConnection from "./tests/connectDbTest";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import postRoute from "./routes/post.routes";
import pool from "./configs/dbConfig";

const Cookie = require("@hapi/cookie");
const Hapi = require("@hapi/hapi");

const init = async () => {
  // Defining the server configuration with CORS
  const server = Hapi.server({
    port: 5000,
    host: "localhost",
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
      isSecure: false,
      ttl: 24 * 60 * 60 * 1000,
      path: "/",
      isSameSite: "Lax",
    },
    redirectTo: `${process.env.FRONTEND_URL}/signup`,
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
      return { isValid: false };
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
    handler: (request: Request, h: ResponseToolkit) => {
      return "Backend is working";
    },
  });

  // Register the routes
  server.route(userRoutes);
  server.route(authRoutes);
  server.route(postRoute);

  await server.start();
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
