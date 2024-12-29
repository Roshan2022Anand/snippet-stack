import { ServerRoute } from "@hapi/hapi";
import pool from "../configs/dbConfig";

type postData = {
  postForm: {
    title: string;
    description: string;
    image: string;
    category: string;
    about: string;
  };
  email: string;
};

const postRoute: ServerRoute[] = [
  //route to create a post
  {
    path: "/api/post",
    method: "POST",
    handler: async (request, h) => {
      try {
        const {
          postForm: { title, description, image, category, about },
          email,
        } = request.payload as postData;
        //checking if the user already exists
        const existsUser = await pool.query(
          `SELECT * FROM users u WHERE u.email = $1`,
          [email]
        );
        if (!existsUser.rows[0])
          return h.response({ error: "User does not exists" }).code(404);

        //if user exists then store the post in DB
        await pool.query(
          `INSERT INTO posts (title, description, image, about,category, user_id)
                     VALUES ($1, $2, $3, $4, $5, $6)`,
          [title, description, image, about, category, existsUser.rows[0].id]
        );

        return h.response({ message: "Post created successfully" }).code(200);
      } catch (err) {
        console.log(err);
        return h.response({ error: "Something went wrong" }).code(500);
      }
    },
  },

//route to get all the posts
{path: '/api/allposts', method: 'GET', handler: async (request, h) => {}},

//route to get a single post
{path: '/api/post/', method: 'GET', handler: async (request, h) => {}},

//route to delete a post
{path: '/api/post/', method: 'DELETE', handler: async (request, h) => {}},

];

export default postRoute;
