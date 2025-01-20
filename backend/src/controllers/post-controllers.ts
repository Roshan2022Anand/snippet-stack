import { Request, ResponseToolkit, ServerRoute } from "@hapi/hapi";
import pool from "../db/dbConfig";
import { BasicPostQuery } from "../db/queries";

type postData = {
  postForm: {
    title: string;
    description: string;
    image: string;
    category: string;
    about: string;
  };
  id: number;
};

//to create a new post
export const createPost = async (request: Request, h: ResponseToolkit) => {
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
};

//to get a single post based on postID
export const getPost = async (request: Request, h: ResponseToolkit) => {
  try {
    const { user_id } = request.auth.credentials;
    const { postId } = request.query as { postId: string };
    const { rows } = await pool.query(
      `${BasicPostQuery}
            WHERE p.post_id = $2
            GROUP BY u.user_id, p.post_id`,
      [user_id, postId]
    );
    if (!rows[0]) return h.response({ error: "Post not found" }).code(404);
    return h.response({ postData: rows[0] }).code(200);
  } catch (err) {
    console.log(err);
    return h.response({ error: "Something went wrong" }).code(500);
  }
};

//to get all posts related to a user
export const getAllUserPosts = async (request: Request, h: ResponseToolkit) => {
  try {
    const { user_id } = request.auth.credentials;
    const { userID, lastID } = request.query as {
      userID: number;
      lastID: number;
    };

    let conditionValue = [user_id, userID];
    if (lastID > 0) conditionValue.push(lastID);

    //fetch all posts related to user_id
    const { rows } = await pool.query(
      `${BasicPostQuery} 
              WHERE u.user_id = $2
              ${lastID > 0 ? `AND p.post_id < $3` : ""}  
              GROUP BY u.user_id,p.post_id
              ORDER BY p.post_id DESC LIMIT 4`,
      conditionValue
    );

    return h.response({ posts: rows }).code(200);
  } catch (err) {
    console.log(err);
    return h.response({ error: "Something went wrong" }).code(500);
  }
};

//to get all random posts
export const getAllRandomPosts = async (
  request: Request,
  h: ResponseToolkit
) => {
  try {
    const { user_id } = request.auth.credentials;
    const { query, lastID } = request.query;

    //initial conditional query values
    let conditionValue = [user_id];
    let conditionQuery = lastID > 0 || query ? `WHERE ` : "";

    //if lastID is given then add lastID condition
    if (lastID > 0) {
      conditionValue.push(lastID);
      conditionQuery += `p.post_id < $${conditionValue.length}`;
    }

    //if query is given then add query condition
    if (query) {
      conditionValue.push(`%${query}%`);
      let val = conditionValue.length;
      conditionQuery += `${
        val == 3 ? ` AND` : ""
      } (fname ILIKE $${val} OR title ILIKE $${val} OR description ILIKE $${val} OR category ILIKE $${val})`;
    }

    //final query to fetch posts
    const finalQuery = `${BasicPostQuery}
        ${conditionQuery}
        GROUP BY u.user_id,p.post_id
        ORDER BY post_id DESC LIMIT 4
        `;

    const { rows } = await pool.query(finalQuery, conditionValue);
    return h.response({ posts: rows }).code(200);
  } catch (err) {
    console.log(err);
    return h.response({ error: "Something went wrong" }).code(500);
  }
};

//to update a post
export const updatePost = async (request: Request, h: ResponseToolkit) => {
  try {
    const {
      postForm: { title, description, image, category, about },
      id,
    } = request.payload as postData;

    //query to update the post
    await pool.query(
      `UPDATE posts SET title = $1, description = $2, image = $3, about = $4, category = $5 WHERE post_id = $6`,
      [title, description, image, about, category, id]
    );

    return h.response({ message: "Post created successfully" }).code(200);
  } catch (err) {
    console.log(err);
    return h.response({ error: "Something went wrong" }).code(500);
  }
};

//to delete a post
export const deletePost = async (request: Request, h: ResponseToolkit) => {
  try {
    const { user_id } = request.auth.credentials;
    const { postID } = request.payload as { postID: number };

    //delete the post if it's a auth user
    await pool.query(`DELETE FROM posts WHERE post_id = $1 AND user_id = $2`, [
      postID,
      user_id,
    ]);

    return h.response({ message: "Post deleted successfully" }).code(200);
  } catch (err) {
    console.log(err);
    return h
      .response({ error: "Something went wrong, Please try again later" })
      .code(500);
  }
};