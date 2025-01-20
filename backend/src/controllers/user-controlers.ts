import pool from "../db/dbConfig";
import { Request, ResponseToolkit } from "@hapi/hapi";

type UserPutPayload = {
  name: string;
  bio: string;
  pic: string | null;
};

//get the user details
export const getUser = async (request: Request, h: ResponseToolkit) => {
  try {
    const { userID } = request.query;

    //query to get the user details
    const { rows } = await pool.query(
      `SELECT user_id, fname, bio, pic FROM users WHERE user_id = ${userID}`
    );

    if (rows) return h.response({ user: rows[0] }).code(200);
    console.log(rows);
    return h.response({ error: "User Not Found" }).code(404);
  } catch (error) {
    console.log(error);
    return h.response({ error: "internal error" }).code(500);
  }
};

// update the user details
export const updateUser = async (request: Request, h: ResponseToolkit) => {
  try {
    const user = request.auth.credentials;
    const { name, bio, pic } = request.payload as UserPutPayload;

    //query to update the user details
    const { rowCount } = await pool.query(
      `UPDATE users SET fname = '${name}', bio = '${bio}', pic = '${pic}' WHERE user_id = ${user.user_id}`
    );

    if (rowCount)
      return h
        .response({ message: "User Data Updated Successfully" })
        .code(200);

    return h
      .response({ message: "User Data Not Updated, Please try again" })
      .code(400);
  } catch (err) {
    console.log(err);
    return h
      .response({
        error: "Something went wrong in server, Please update after sometimes",
      })
      .code(500);
  }
};

//delete the user
export const deleteUser = async (request: Request, h: ResponseToolkit) => {
  try {
    const { user_id } = request.auth.credentials;

    //query to get the user pic and posts images to delete it from supabase storage
    const { rows } = await pool.query(
      `SELECT 
            MAX(u.pic) AS pic,
            ARRAY_AGG(p.image) AS img
            FROM users u INNER JOIN posts p ON u.user_id = p.user_id
            WHERE u.user_id = ${user_id}`
    );
    const imgArr = [rows[0].pic, ...rows[0].img];

    const { rowCount } = await pool.query(
      `DELETE FROM users WHERE user_id = ${user_id}`
    );

    //@ts-ignore
    request.cookieAuth.clear();

    if (rowCount)
      return h
        .response({ message: "Account Deleted succesfully", imgArr })
        .code(200);
    return h.response({ error: "User Not Found" }).code(404);
  } catch (error) {
    console.log(error);
    return h.response({ error: "internal error" }).code(500);
  }
};
