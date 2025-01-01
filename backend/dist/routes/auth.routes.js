"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dbConfig_1 = __importDefault(require("../configs/dbConfig"));
const authRoutes = [
    // route to get authenticated user details
    {
        path: "/api/auth",
        method: "GET",
        handler: async (request, h) => {
            const user = request.auth.credentials;
            if (user) {
                return h.response({ user }).code(200);
            }
            return h.response({ user: null }).code(200);
        },
    },
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
                await dbConfig_1.default.query(`INSERT INTO users (fname, email, fpassword)
                     VALUES ($1, $2, $3)`, [name, email, hashedPassword]);
                //@ts-ignore
                request.cookieAuth.set({ name, email });
                return h.response({ message: "Successfully signed up" }).code(200);
            }
            catch (err) {
                console.log(err);
                return h.response({ error: "Something went wrong" }).code(500);
            }
        },
        options: {
            auth: false,
        },
    },
    // route for logging in
    {
        path: "/api/login",
        method: "GET",
        options: {
            auth: false,
        },
        handler: async (request, h) => {
            try {
                const { email, password } = request.query;
                //checking if the user exists
                const { rows } = await dbConfig_1.default.query(`SELECT * FROM users u WHERE u.email = $1`, [email]);
                const user = rows[0];
                if (!user)
                    return h.response({ error: "User Does not exists" }).code(401);
                //checking if the password is correct
                const isValid = await bcryptjs_1.default.compareSync(password, user.fpassword);
                if (isValid) {
                    //@ts-ignore
                    request.cookieAuth.set({
                        name: user.fname,
                        email: user.email,
                    });
                    return h.response({ message: "Logged in successfully" }).code(200);
                }
                return h.response({ error: "Invalid password" }).code(401);
            }
            catch (err) {
                console.log(err);
                return h.response({ error: "Something went wrong" }).code(500);
            }
        },
    },
    // route for logging out
    {
        path: "/api/logout",
        method: "GET",
        handler: async (request, h) => {
            //@ts-ignore
            request.cookieAuth.clear();
            return h.response({ message: "Logged out successfully" }).code(200);
        },
    },
];
exports.default = authRoutes;
