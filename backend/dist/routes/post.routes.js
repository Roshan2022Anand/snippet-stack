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
                const { userID, lastID } = request.query;
                //fetch all posts of the given user id or the logged in user
                let posts;
                if (lastID > 0) {
                    const { rows } = await dbConfig_1.default.query(`SELECT * FROM posts 
              WHERE user_id = $1 AND post_id < $2 
              ORDER BY post_id DESC LIMIT 4`, [userID, lastID]);
                    posts = rows;
                }
                else {
                    const { rows } = await dbConfig_1.default.query(`SELECT * FROM posts 
              WHERE user_id = $1
              ORDER BY post_id DESC LIMIT 4`, [userID]);
                    posts = rows;
                }
                return h.response({ posts }).code(200);
            }
            catch (err) {
                console.log(err);
                return h.response({ error: "Something went wrong" }).code(500);
            }
        },
    },
    //route to get all the posts
    {
        path: "/api/allposts",
        method: "GET",
        handler: async (request, h) => {
            try {
                const { user_id } = request.auth.credentials;
                const { query, lastID } = request.query;
                let posts;
                if (query && lastID > 0) {
                    //query to search posts based on query and lastID
                    const { rows } = await dbConfig_1.default.query(`${queries_1.BasicPostQuery}
          WHERE (fname ILIKE $2 OR title ILIKE $2 OR description ILIKE $2 OR category ILIKE $2) AND p.post_id < $3
          GROUP BY u.user_id,p.post_id;`, [user_id, `%${query}%`, lastID]);
                    posts = rows;
                }
                else if (query) {
                    //query to search posts based on query
                    const { rows } = await dbConfig_1.default.query(`${queries_1.BasicPostQuery}
                WHERE fname ILIKE $2 OR title ILIKE $2 OR description ILIKE $2 OR category ILIKE $2
                 GROUP BY u.user_id,p.post_id
                 ORDER BY post_id DESC LIMIT 4`, [user_id, `%${query}%`]);
                    posts = rows;
                }
                else if (lastID > 0) {
                    //query to fetch more posts based on lastID
                    const { rows } = await dbConfig_1.default.query(`${queries_1.BasicPostQuery}
                WHERE p.post_id < $2 
                GROUP BY u.user_id,p.post_id
                ORDER BY post_id DESC LIMIT 4`, [user_id, lastID]);
                    posts = rows;
                }
                else {
                    //query to fetch new posts
                    const { rows } = await dbConfig_1.default.query(`${queries_1.BasicPostQuery}
            GROUP BY u.user_id, p.post_id
            ORDER BY post_id DESC LIMIT 4`, [user_id]);
                    posts = rows;
                }
                return h.response({ posts }).code(200);
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
                const { postId } = request.query;
                const { rows } = await dbConfig_1.default.query(`${queries_1.BasicPostQuery}
            WHERE p.post_id = $1
            GROUP BY u.user_id, p.post_id`, [postId]);
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
        handler: async (request, h) => { },
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
