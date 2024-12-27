import { ServerRoute } from "@hapi/hapi";
import pool from "../configs/dbConfig";

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
