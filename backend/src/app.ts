import Hapi from "@hapi/hapi";
import testDbConnection from "./tests/connectDbTest";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import Bcrypt from "bcryptjs";
import pool from "./configs/dbConfig";
import { Session } from "inspector/promises";
import path from "path";
import postRoute from "./routes/post.routes";

const Cookie = require("@hapi/cookie");

// Create a new server instance
const init = async () => {
  const server = Hapi.server({
    port: 5000,
    host: "localhost",
    routes: {
      cors: {
        origin: ["http://localhost:3000"],
        credentials: true,
      },
    },
  });

  // Register the cookie plugin
  // await server.register(Cookie);
  // server.auth.strategy("session", "cookie", {
  //   cookie: {
  //     name: "session",
  //     password: "passwordpasswordpasswordpassword",
  //     isSecure: false,
  //     path: "/",
  //   },
  //   redirectTo: "http://localhost:3000/signup",
  //   keepAlive: true,
  //   validate: async ({ request, session }: { request: any; session: any }) => {
  //     console.log("session", session);
      
  //     const user = await pool.query(
  //       `SELECT * FROM users u WHERE u.email = $1`,
  //       [session.email]
  //     );
  //     if (!user.rows[0]) return { valid: false };
  //     return { valid: true, credentials: user.rows[0] };
  //   },
  // });
  // server.auth.default("session");

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
