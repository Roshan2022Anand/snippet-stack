import { Request, ResponseToolkit, ServerRoute } from "@hapi/hapi";
import pool from "../db/dbConfig";

const PostUtilsRoutes: ServerRoute[] = [
  //route to update the value of the vote
  {
    path: "/api/vote",
    method: "PUT",
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const { user_id } = request.auth.credentials;
        const { voteType, post_id } = request.payload as {
          voteType: boolean;
          post_id: number;
        };

        const { rows } = await pool.query(
          `SELECT * FROM votes WHERE user_id = $1 AND post_id = $2`,
          [user_id, post_id]
        );

        //if the user have already voted then update the vote
        if (rows.length > 0)
          await pool.query(
            `UPDATE votes SET vote_type = $1 WHERE user_id = $2 AND post_id = $3`,
            [voteType, user_id, post_id]
          );
        else
          await pool.query(
            `INSERT INTO votes (user_id, post_id, vote_type) VALUES ($1, $2, $3)`,
            [user_id, post_id, voteType]
          );

        //return the total votes
        const res = await pool.query(
          `SELECT 
            SUM(CASE WHEN vote_type THEN 1 ELSE 0 END) AS up_votes,
            SUM(CASE WHEN NOT vote_type THEN 1 ELSE 0 END) AS down_votes
            FROM votes 
            WHERE post_id = $1`,
          [post_id]
        );
        const { up_votes, down_votes } = res.rows[0];
        return h
          .response({ message: "voted successfully", up_votes, down_votes })
          .code(200);
      } catch (err) {
        console.log(err);
        return h
          .response({ error: "Internal Server Error, please try again" })
          .code(500);
      }
    },
  },

  //route to add a comment
  {
    path: "/api/comment",
    method: "POST",
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const { user_id } = request.auth.credentials;

        const { postID, reply } = request.payload as {
          postID: number;
          reply: string;
        };

        //query to add the comment
        await pool.query(
          `INSERT INTO comments (user_id, post_id, fcontent) 
            VALUES ($1, $2, $3)`,
          [user_id, postID, reply]
        );

        return h.response({ message: "Comment added" }).code(200);
      } catch (err) {
        console.log(err);
        return h
          .response({ error: "Internal Server Error, please try again" })
          .code(500);
      }
    },
  },

  //route to get all the comments
  {
    path: "/api/comment",
    method: "GET",
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const { postID } = request.query;

        const { rows } = await pool.query(
          `SELECT 
            u.pic, u.fname,u.user_id,c.fcontent,c.created_at 
            FROM comments c
            INNER JOIN users u ON u.user_id = c.user_id
            WHERE c.post_id = $1`,
          [postID]
        );

        return h.response({ rows }).code(200);
      } catch (err) {
        console.log(err);
        return h
          .response({ error: "Internal Server Error, please try again" })
          .code(500);
      }
    },
  },
];

export default PostUtilsRoutes;
