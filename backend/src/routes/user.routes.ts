import { ServerRoute } from "@hapi/hapi";
import pool from "../configs/dbConfig";
import { Request, ResponseToolkit } from "@hapi/hapi";

type UserPutPayload = {
  name: string;
  bio: string;
  pic: string | null;
};

//Routes for all User operations
const userRoutes: ServerRoute[] = [
  //API endpoint to update the user details
  {
    path: "/api/user",
    method: "PUT",
    handler: async (request: Request, h: ResponseToolkit) => {
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
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const { user_id } = request.auth.credentials;
        const { rowCount } = await pool.query(
          `DELETE FROM users WHERE user_id = ${user_id}`
        );

        //@ts-ignore
        request.cookieAuth.clear();

        if (rowCount)
          return h
            .response({ message: "Account Deleted succesfully" })
            .code(200);
        return h.response({ error: "User Not Found" }).code(404);
      } catch (error) {
        console.log(error);
        return h.response({ error: "internal error" }).code(500);
      }
    },
  },
];

export default userRoutes;
