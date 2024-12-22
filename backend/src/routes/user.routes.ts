import { ServerRoute } from "@hapi/hapi";
import pool from "../configs/dbConfig";
import { log } from "console";

type userReq = {
  email: string;
  name: string;
  image: string;
};

const userRoutes: ServerRoute[] = [
  { path: "/api/user", method: "GET", handler: async (request, h) => {} },
  {
    path: "/api/user",
    method: "POST",
    handler: async (request, h) => {
      try {
        const { email, name, image }: userReq = request.payload as userReq;
        const userExists = await pool.query(
          `SELECT EXISTS(SELECT 1 FROM users u WHERE u.email = '${email}')`
        );

        //if user does not exists then add them
        if (!userExists.rows[0].exists) {
          const res = await pool.query(`INSERT INTO users(name,email,image)
            VALUES ('${name}','${email}','${image}')`);
          return h.response("Welcome to Snippet-stack").code(200);
        }
        return h.response(`Welcome back ${name}`).code(200);
      } catch (err) {
        console.log(err);
        return h.response("internal error").code(500);
      }
    },
  },
];

export default userRoutes;