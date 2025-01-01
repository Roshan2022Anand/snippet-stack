"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbConfig_1 = __importDefault(require("../configs/dbConfig"));
const postRoute = [
    //route to create a post
    {
        path: "/api/post",
        method: "POST",
        handler: async (request, h) => {
            try {
                const { postForm: { title, description, image, category, about }, email, } = request.payload;
                //checking if the user already exists
                const existsUser = await dbConfig_1.default.query(`SELECT * FROM users u WHERE u.email = $1`, [email]);
                if (!existsUser.rows[0])
                    return h.response({ error: "User does not exists" }).code(404);
                //if user exists then store the post in DB
                await dbConfig_1.default.query(`INSERT INTO posts (title, description, image, about,category, user_id) VALUES ($1, $2, $3, $4, $5, $6)`, [title, description, image, about, category, existsUser.rows[0].user_id]);
                return h.response({ message: "Post created successfully" }).code(200);
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
        options: {
            auth: false,
        },
        handler: async (request, h) => {
            try {
                const { query, lastID } = request.query;
                let posts;
                if (query) {
                    //Get posts data based on query
                }
                else {
                    if (lastID > 0) {
                        const { rows } = await dbConfig_1.default.query(`SELECT * FROM users u
              INNER JOIN posts p ON u.user_id = p.user_id
              WHERE post_id < ${lastID} 
              ORDER BY post_id DESC LIMIT 4`);
                        posts = rows;
                    }
                    else {
                        const { rows } = await dbConfig_1.default.query(`SELECT * FROM users u
              INNER JOIN posts p ON u.user_id = p.user_id ORDER BY post_id DESC LIMIT 4`);
                        posts = rows;
                    }
                }
                return h.response(posts).code(200);
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
                const { rows } = await dbConfig_1.default.query(`SELECT * FROM users u
           INNER JOIN posts p ON u.user_id = p.user_id
           WHERE post_id = $1`, [postId]);
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
    //route to delete a post
    { path: "/api/post/", method: "DELETE", handler: async (request, h) => { } },
];
exports.default = postRoute;
