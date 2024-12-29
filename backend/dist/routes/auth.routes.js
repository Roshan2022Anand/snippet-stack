"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dbConfig_1 = __importDefault(require("../configs/dbConfig"));
const authRoutes = [
    // route for signing up
    {
        path: "/api/signup",
        method: "POST",
        handler: async (request, h) => {
            try {
                const { name, email, password } = request.payload;
                //checking if the user already exists
                const existsUser = await dbConfig_1.default.query(`SELECT * FROM users u WHERE u.email = $1`, [email]);
                if (existsUser.rows[0])
                    return h.response({ error: "User already exists" }).code(409);
                //if new user then hash the password and store data in  DB
                const hashedPassword = await bcryptjs_1.default.hash(password, 10);
                await dbConfig_1.default.query(`INSERT INTO users (fname, email, fpassword) VALUES ($1, $2, $3)`, [name, email, hashedPassword]);
                //set cookie
                request.cookieAuth.set({ email });
                return h.response({ message: "Successfully signed up" }).code(200);
            }
            catch (err) {
                console.log(err);
                return h.response({ error: "Something went wrong" }).code(500);
            }
        },
        options: {
            auth: {
                mode: "try",
            },
        },
    },
    // route for logging in
    {
        path: "/api/login",
        method: "GET",
        handler: async (request, h) => {
            const { email, password } = request.query;
            //   const { isValid, credentials } = await validate({ email, password });
            //   if (!isValid) {
            //     return h.response({ message: "Invalid email or password" }).code(401);
            //   }
            //   return h
            //     .response({ message: "Login successful", user: credentials })
            //     .code(200);
        },
        options: {
            auth: {
                mode: "try",
            },
        },
    },
    // route for logging out
    { path: "/api/logout", method: "GET", handler: async (request, h) => { } },
    //route for authenticating the user
    {
        path: "/api/auth",
        method: "GET",
        handler: async (request, h) => {
            try {
                const user = request.auth.credentials;
                console.log(user);
                return h.response({ message: "User Authenticated", user }).code(200);
            }
            catch (err) {
                return h.response("internal error").code(500);
            }
        },
    },
];
exports.default = authRoutes;
