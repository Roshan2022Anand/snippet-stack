//@ts-nocheck
import { ServerRoute } from "@hapi/hapi";
import Bcrypt from "bcryptjs";
import pool from "../configs/dbConfig";

const authRoutes: ServerRoute[] = [
  // route for checking if the user is authenticated
  {
    path: "/api/auth",
    method: "GET",
    handler: async (request, h) => {
      const user = request.auth.credentials;
      if (user) {
        return h.response({ user }).code(200);
      }
      return h.response({ user: null }).code(200);
    },
  },

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

        request.cookieAuth.set({ name, email });

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
    options: {
      auth: false,
    },
    handler: async (request, h) => {
      try {
        const { email, password } = request.query as {
          email: string;
          password: string;
        };

        //checking if the user exists
        const { rows } = await pool.query(
          `SELECT * FROM users u WHERE u.email = $1`,
          [email]
        );
        const user = rows[0];

        if (!user) return h.response({ message: "Invalid email" }).code(401);

        //checking if the password is correct
        const isValid = await Bcrypt.compareSync(password, user.fpassword);
        if (isValid) {
          //setting the cookie
          request.cookieAuth.set({
            name: user.fname,
            email: user.email,
          });
          return h.response({ message: "Logged in successfully" }).code(200);
        }

        return h.response({ message: "Invalid password" }).code(401);
      } catch (err) {
        console.log(err);
        return h.response({ error: "Something went wrong" }).code(500);
      }
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
      request.cookieAuth.clear();
      return h.response({ message: "Logged out successfully" }).code(200);
    },
  },
];

export default authRoutes;
