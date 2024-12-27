import Hapi from "@hapi/hapi";
import testDbConnection from "./tests/connectDbTest";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";

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

  await testDbConnection();

  // Register the routes
  server.route(userRoutes);
  server.route(authRoutes);

  await server.start();
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
