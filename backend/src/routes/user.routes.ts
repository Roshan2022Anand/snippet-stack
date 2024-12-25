import { ServerRoute } from "@hapi/hapi";
import pool from "../configs/dbConfig";
import { console } from "inspector";

type userPostPayload = {
  email: string;
  name: string;
  image: string;
};

type userPutPayload = {
  updatedUserData: { name: string; bio: string };
  userID: number;
};

//Routes for all User operations
const userRoutes: ServerRoute[] = [
  //API endpoint to read the details of user
  {
    path: "/api/user",
    method: "GET",
    handler: async (request, h) => {
      try {
        const { userID } = request.query;
        const currUser = await pool.query(
          `SELECT * FROM users u WHERE u.user_id = ${userID}`
        );
        return h
          .response({
            message: "User Data Found",
            userData: currUser.rows[0],
          })
          .code(200);
      } catch (err) {
        return h.response("internal error").code(500);
      }
    },
  },

  //API endpoint to Add the details of user
  {
    path: "/api/user",
    method: "POST",
    handler: async (request, h) => {
      try {
        const { email, name, image }: userPostPayload =
          request.payload as userPostPayload;

        //Query to check if the users exists or not
        const userExists = await pool.query(
          `SELECT user_id FROM users u WHERE u.email = '${email}'`
        );

        //If Exists send Welcome back msg
        if (userExists.rows.length > 0) {
          return h
            .response({
              message: `Welcome back ${name}`,
              id: userExists.rows[0].user_id,
            })
            .code(200);
        }

        //if not exist the add them to the DB
        const res = await pool.query(`INSERT INTO users(name,email,image)
          VALUES ('${name}','${email}','${image}') RETURNING user_id`);

        return h
          .response({
            message: `Welcome to sippet-stack`,
            id: res.rows[0].user_id,
          })
          .code(200);
      } catch (err) {
        return h.response("internal error").code(500);
      }
    },
  },

  //API endpoint to update the user details
  {
    path: "/api/user",
    method: "PUT",
    handler: async (request, h) => {
      try {
        const { updatedUserData, userID }: userPutPayload =
          request.payload as userPutPayload;
        const res = await pool.query(
          `UPDATE users SET name = '${updatedUserData.name}', bio = '${updatedUserData.bio}' WHERE user_id = ${userID}`
        );
        if (res.rowCount)
          return h
            .response({ message: "User Data Updated Successfully" })
            .code(200);

        return h
          .response({ message: "User Data Not Updated, Please try again" })
          .code(200);
      } catch (err) {
        return h
          .response({
            error:
              "Something went wrong in server, Please update after sometimes",
          })
          .code(500);
      }
    },
  },

  //API endpoint to delete the user
  {
    path: "/api/user",
    method: "DELETE",
    handler: async (request, h) => {
      try {
        const { userID } = request.query;
        const res = await pool.query(
          `DELETE FROM users WHERE user_id = ${userID}`
        );
        if (res.rowCount) return h.response({message:"Deleted succesfully"}).code(200);
        return h.response("User Not Found").code(404);
      } catch (error) {
        console.log(error);
        return h.response("internal error").code(500);
      }
    },
  },
];

export default userRoutes;
