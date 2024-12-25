import Hapi from "@hapi/hapi";
import testDbConnection from "./tests/connectDbTest";
import empRoutes from "./routes/emp.routes";
import userRoutes from "./routes/user.routes";
const init = async () => {
  const server = Hapi.server({
    port: 5000,
    host: "localhost",
    routes:{
      cors:{
        origin:["http://localhost:3000"],
        credentials:true,
      }
    }
  });
  server.route({
    method: "GET",
    path: "/",
    handler: async (request, h) => {
      const res = await testDbConnection();
      return res;
    },
  });

  server.route(empRoutes);
  server.route(userRoutes);

  await server.start();
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
