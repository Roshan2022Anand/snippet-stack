import { Request, ResponseToolkit, ServerRoute } from "@hapi/hapi";
import pool from "../configs/dbConfig";

type postData = {
  postForm: {
    title: string;
    description: string;
    image: string;
    category: string;
    about: string;
  };
};

const postRoute: ServerRoute[] = [
  //route to create a post
  {
    path: "/api/post",
    method: "POST",
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const { user_id } = request.auth.credentials;

        const {
          postForm: { title, description, image, category, about },
        } = request.payload as postData;

        await pool.query(
          `INSERT INTO posts (title, description, image, about,category, user_id) VALUES ($1, $2, $3, $4, $5, $6)`,
          [title, description, image, about, category, user_id]
        );

        return h.response({ message: "Post created successfully" }).code(200);
      } catch (err) {
        console.log(err);
        return h.response({ error: "Something went wrong" }).code(500);
      }
    },
  },

  //route to get all the posts of the user
  {
    path: "/api/alluserposts",
    method: "GET",
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const { userID, lastID } = request.query as {
          userID: number;
          lastID: number;
        };

        //fetch all posts of the given user id or the logged in user

        let posts;
        if (lastID > 0) {
          const { rows } = await pool.query(
            `SELECT * FROM posts 
              WHERE user_id = $1 AND post_id < $2 
              ORDER BY post_id DESC LIMIT 4`,
            [userID, lastID]
          );
          posts = rows;
        } else {
          const { rows } = await pool.query(
            `SELECT * FROM posts 
              WHERE user_id = $1
              ORDER BY post_id DESC LIMIT 4`,
            [userID]
          );
          posts = rows;
        }

        return h.response({ posts }).code(200);
      } catch (err) {
        console.log(err);
        return h.response({ error: "Something went wrong" }).code(500);
      }
    },
  },

  //route to get all the posts
  {
    path: "/api/allposts",
    method: "GET",
    options: {
      auth: false,
    },
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const { query, lastID } = request.query;
        let posts;
        //Get posts data based on query
        if (query) {
          if (lastID > 0) {
            const { rows } = await pool.query(
              `SELECT * FROM users u
                INNER JOIN posts p ON u.user_id = p.user_id
                WHERE (fname ILIKE $1 OR title ILIKE $1 OR description ILIKE $1 OR category ILIKE $1) AND post_id < $2`,
              [`%${query}%`, lastID]
            );
            posts = rows;
          }else {
            const { rows } = await pool.query(
              `SELECT * FROM users u
                INNER JOIN posts p ON u.user_id = p.user_id
                WHERE fname ILIKE $1 OR title ILIKE $1 OR description ILIKE $1 OR category ILIKE $1`,
              [`%${query}%`]
            );
            posts = rows;
          }
        } else {
          if (lastID > 0) {
            const { rows } = await pool.query(
              `SELECT * FROM users u
              INNER JOIN posts p ON u.user_id = p.user_id
              WHERE post_id < ${lastID} 
              ORDER BY post_id DESC LIMIT 4`
            );
            posts = rows;
          } else {
            const { rows } = await pool.query(
              `SELECT * FROM users u
              INNER JOIN posts p ON u.user_id = p.user_id 
              ORDER BY post_id DESC LIMIT 4`
            );
            posts = rows;
          }
        }
        return h.response({ posts }).code(200);
      } catch (err) {
        console.log(err);
        return h.response({ error: "Something went wrong" }).code(500);
      }
    },
  },

  //route to get a single post
  {
    path: "/api/post",
    method: "GET",
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const { postId } = request.query as { postId: string };
        const { rows } = await pool.query(
          `SELECT * FROM users u
           INNER JOIN posts p ON u.user_id = p.user_id
           WHERE post_id = $1`,
          [postId]
        );
        if (!rows[0]) return h.response({ error: "Post not found" }).code(404);
        return h.response({ postData: rows[0] }).code(200);
      } catch (err) {
        console.log(err);
        return h.response({ error: "Something went wrong" }).code(500);
      }
    },
  },

  //route to delete a post
  {
    path: "/api/post",
    method: "DELETE",
    handler: async (request, h) => {
      try {
        const { user_id } = request.auth.credentials;
        const { postID } = request.payload as { postID: number };

        //delete the post if it's a auth user
        await pool.query(
          `DELETE FROM posts WHERE post_id = $1 AND user_id = $2`,
          [postID, user_id]
        );

        return h.response({ message: "Post deleted successfully" }).code(200);
      } catch (err) {
        console.log(err);
        return h
          .response({ error: "Something went wrong, Please try again later" })
          .code(500);
      }
    },
  },
];

export default postRoute;
