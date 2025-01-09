"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbConfig_1 = __importDefault(require("../db/dbConfig"));
const queries_1 = require("../db/queries");
const PostRoute = [
    //route to create a post
    {
        path: "/api/post",
        method: "POST",
        handler: async (request, h) => {
            try {
                const { user_id } = request.auth.credentials;
                const { postForm: { title, description, image, category, about }, } = request.payload;
                await dbConfig_1.default.query(`INSERT INTO posts (title, description, image, about,category, user_id) VALUES ($1, $2, $3, $4, $5, $6)`, [title, description, image, about, category, user_id]);
                return h.response({ message: "Post created successfully" }).code(200);
            }
            catch (err) {
                console.log(err);
                return h.response({ error: "Something went wrong" }).code(500);
            }
        },
    },
    //route to get all the posts of the user
    {
        path: "/api/alluserposts",
        method: "GET",
        handler: async (request, h) => {
            try {
                const { user_id } = request.auth.credentials;
                const { userID, lastID } = request.query;
                let conditionValue = [user_id, userID];
                if (lastID > 0)
                    conditionValue.push(lastID);
                //fetch all posts related to user_id
                const { rows } = await dbConfig_1.default.query(`${queries_1.BasicPostQuery} 
              WHERE u.user_id = $2
              ${lastID > 0 ? `AND p.post_id < $3` : ""}  
              GROUP BY u.user_id,p.post_id
              ORDER BY p.post_id DESC LIMIT 4`, conditionValue);
                return h.response({ posts: rows }).code(200);
            }
            catch (err) {
                console.log(err);
                return h.response({ error: "Something went wrong" }).code(500);
            }
        },
    },
    //route to get all the posts
    // {
    //   path: "/api/allposts",
    //   method: "GET",
    //   handler: async (request: Request, h: ResponseToolkit) => {
    //     try {
    //       const { user_id } = request.auth.credentials;
    //       const { query, lastID } = request.query;
    //       let posts;
    // if (query && lastID > 0) {
    //   //query to search posts based on query and lastID
    //   const { rows } = await pool.query(
    //     `${BasicPostQuery}
    //   WHERE (fname ILIKE $2 OR title ILIKE $2 OR description ILIKE $2 OR category ILIKE $2) AND p.post_id < $3
    //   GROUP BY u.user_id,p.post_id
    //   ORDER BY post_id DESC LIMIT 4`,
    //     [user_id, `%${query}%`, lastID]
    //   );
    //   posts = rows;
    // } else if (query) {
    //   //query to search posts based on query
    //   const { rows } = await pool.query(
    //     `${BasicPostQuery}
    //         WHERE fname ILIKE $2 OR title ILIKE $2 OR description ILIKE $2 OR category ILIKE $2
    //          GROUP BY u.user_id,p.post_id
    //          ORDER BY post_id DESC LIMIT 4`,
    //     [user_id, `%${query}%`]
    //   );
    //   posts = rows;
    // } else if (lastID > 0) {
    //   //query to fetch more posts based on lastID
    //   const { rows } = await pool.query(
    //     `${BasicPostQuery}
    //         WHERE p.post_id < $2
    //         GROUP BY u.user_id,p.post_id
    //         ORDER BY post_id DESC LIMIT 4`,
    //     [user_id, lastID]
    //   );
    //   posts = rows;
    // } else {
    //   //query to fetch new posts
    //   const { rows } = await pool.query(
    //     `${BasicPostQuery}
    //     GROUP BY u.user_id, p.post_id
    //     ORDER BY post_id DESC LIMIT 4`,
    //     [user_id]
    //   );
    //   posts = rows;
    // }
    //       return h.response({ posts }).code(200);
    //     } catch (err) {
    //       console.log(err);
    //       return h.response({ error: "Something went wrong" }).code(500);
    //     }
    //   },
    // },
    {
        path: "/api/allposts",
        method: "GET",
        handler: async (request, h) => {
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
                    conditionQuery += `${val == 3 ? ` AND` : ""} (fname ILIKE $${val} OR title ILIKE $${val} OR description ILIKE $${val} OR category ILIKE $${val})`;
                }
                //final query to fetch posts
                const finalQuery = `${queries_1.BasicPostQuery}
        ${conditionQuery}
        GROUP BY u.user_id,p.post_id
        ORDER BY post_id DESC LIMIT 4
        `;
                const { rows } = await dbConfig_1.default.query(finalQuery, conditionValue);
                return h.response({ posts: rows }).code(200);
            }
            catch (err) {
                console.log(err);
                return h.response({ error: "Something went wrong" }).code(500);
            }
        },
    },
    //route to get a single post
    {
        path: "/api/post",
        method: "GET",
        handler: async (request, h) => {
            try {
                const { user_id } = request.auth.credentials;
                const { postId } = request.query;
                const { rows } = await dbConfig_1.default.query(`${queries_1.BasicPostQuery}
            WHERE p.post_id = $2
            GROUP BY u.user_id, p.post_id`, [user_id, postId]);
                if (!rows[0])
                    return h.response({ error: "Post not found" }).code(404);
                return h.response({ postData: rows[0] }).code(200);
            }
            catch (err) {
                console.log(err);
                return h.response({ error: "Something went wrong" }).code(500);
            }
        },
    },
    //route to update a post
    {
        path: "/api/post",
        method: "PUT",
        handler: async (request, h) => {
            try {
                const { postForm: { title, description, image, category, about }, id, } = request.payload;
                //query to update the post
                await dbConfig_1.default.query(`UPDATE posts SET title = $1, description = $2, image = $3, about = $4, category = $5 WHERE post_id = $6`, [title, description, image, about, category, id]);
                return h.response({ message: "Post created successfully" }).code(200);
            }
            catch (err) {
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
                const { postID } = request.payload;
                //delete the post if it's a auth user
                await dbConfig_1.default.query(`DELETE FROM posts WHERE post_id = $1 AND user_id = $2`, [postID, user_id]);
                return h.response({ message: "Post deleted successfully" }).code(200);
            }
            catch (err) {
                console.log(err);
                return h
                    .response({ error: "Something went wrong, Please try again later" })
                    .code(500);
            }
        },
    },
];
exports.default = PostRoute;
