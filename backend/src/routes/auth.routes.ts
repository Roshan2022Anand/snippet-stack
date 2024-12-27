import { ServerRoute } from "@hapi/hapi";
import Bcrypt from "bcryptjs";
import pool from "../configs/dbConfig";


const authRoutes: ServerRoute[] = [
  // route for signing up
  {
    path: "/api/signup",
    method: "POST",
    handler: async (request, h) => {
      try {
        const { name, email, password } = request.payload as {
          name: string;
          email: string;
          password: string;
        };

        //checking if the user already exists
        const existsUser = await pool.query(
          `SELECT * FROM users u WHERE u.email = $1`,
          [email]
        );

        if (existsUser.rows[0])
          return h.response({ error: "User already exists" }).code(409);

        //if new user then hash the password and store data in  DB
        const hashedPassword = await Bcrypt.hash(password, 10);
        await pool.query(
          `INSERT INTO users (fname, email, fpassword) VALUES ($1, $2, $3)`,
          [name, email, hashedPassword]
        );

        return h.response({ message: "Successfully signed up" }).code(200);
      } catch (err) {
        console.log(err);
        return h.response({ error: "Something went wrong" }).code(500);
      }
    },
  },

];

export default authRoutes;
