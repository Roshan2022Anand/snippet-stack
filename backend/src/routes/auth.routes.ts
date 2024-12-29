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
          `INSERT INTO users (fname, email, fpassword)
                     VALUES ($1, $2, $3)`,
          [name, email, hashedPassword]
        );

        // @ts-ignore
        // request.cookieAuth.set({ name, email });

        return h.response({ message: "Successfully signed up" }).code(200);
      } catch (err) {
        console.log(err);
        return h.response({ error: "Something went wrong" }).code(500);
      }
    },
    options: {
      auth: false,
    },
  },

  // route for logging in
  {
    path: "/api/login",
    method: "GET",
    handler: async (request, h) => {
      const { email, password } = request.query as {
        email: string;
        password: string;
      };
      //   const { isValid, credentials } = await validate({ email, password });

      //   if (!isValid) {
      //     return h.response({ message: "Invalid email or password" }).code(401);
      //   }

      //   return h
      //     .response({ message: "Login successful", user: credentials })
      //     .code(200);
    },
    options: {
      auth: false,
    },
  },

  // route for logging out
  {
    path: "/api/logout",
    method: "GET",
    handler: async (request, h) => {
      //@ts-ignore
      request.cookieAuth.clear();
      return h.response({ message: "Logged out successfully" }).code(200);
    },
  },

  // route for checking if the user is authenticated
  {
    path: "/api/auth",
    method: "GET",
    handler: async (request, h) => {
      console.log("hai");
      h.response({ user: null }).code(200);
    },
  },
];

export default authRoutes;
