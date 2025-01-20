import { Request, ResponseToolkit } from "@hapi/hapi";
import Bcrypt from "bcryptjs";
import pool from "../db/dbConfig";

//to signup a new user
export const userSignup = async (request: Request, h: ResponseToolkit) => {
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

    //@ts-ignore
    request.cookieAuth.set({ name, email });

    return h.response({ message: "Successfully signed up" }).code(200);
  } catch (err) {
    console.log(err);
    return h.response({ error: "Something went wrong" }).code(500);
  }
};

//to login a user
export const userLogin = async (request: Request, h: ResponseToolkit) => {
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

    if (!user) return h.response({ error: "User Does not exists" }).code(401);

    //checking if the password is correct
    const isValid = await Bcrypt.compareSync(password, user.fpassword);

    if (isValid) {
      //@ts-ignore
      request.cookieAuth.set({
        name: user.fname,
        email: user.email,
      });
      return h.response({ message: "Logged in successfully" }).code(200);
    }

    return h.response({ error: "Invalid password" }).code(401);
  } catch (err) {
    console.log(err);
    return h.response({ error: "Something went wrong" }).code(500);
  }
};

//to get auth details
export const getAuthDetails = async (request: Request, h: ResponseToolkit) => {
  const user = request.auth.credentials;
  return h.response({ user }).code(200);
};

//to logout a user
export const userLogout = async (request: Request, h: ResponseToolkit) => {
  //@ts-ignore
  request.cookieAuth.clear();
  return h.response({ message: "Logged out successfully" }).code(200);
};