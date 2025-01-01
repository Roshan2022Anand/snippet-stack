import Hapi from "@hapi/hapi";
import testDbConnection from "./tests/connectDbTest";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import Bcrypt from "bcryptjs";
import postRoute from "./routes/post.routes";
import pool from "./configs/dbConfig";
import path from "path";
const Bell = require("@hapi/bell");
const Cookie = require("@hapi/cookie");

// Create a new server instance
const init = async () => {
  const server = Hapi.server({
    port: 5000,
    host: "localhost",
    routes: {
      cors: {
        origin: [process.env.FRONTEND_URL as string],
        credentials: true,
        additionalHeaders: ["cookie"],
      },
    },
  });

  // Register the bell strategy
  await server.register(Bell);
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
      const {rows} = await pool.query(
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
