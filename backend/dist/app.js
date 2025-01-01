"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Cookie = require("@hapi/cookie");
const Hapi = require("@hapi/hapi");
const testDbConnection = require("./tests/connectDbTest");
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const postRoute = require("./routes/post.routes");
const pool = require("./configs/dbConfig");
const dotenv = require("dotenv");
// Create a new server instance
const init = async () => {
    const server = Hapi.server({
        port: 5000,
        host: "localhost",
        routes: {
            cors: {
                //origin from env file FRONTEND_URL
                origin: [process.env.FRONTEND_URL],
                credentials: true,
            },
        },
    });
    // Register the bell strategy
    await server.register(Cookie);
    // Register the cookie auth strategy
    server.auth.strategy("session", "cookie", {
        cookie: {
            name: "session",
            password: "!wsYhFA*C2U6nz=Bu^X2@2beCem8kSR6",
            isSecure: false,
            ttl: 24 * 60 * 60 * 1000,
            path: "/",
            isSameSite: "Lax",
        },
        redirectTo: `${process.env.FRONTEND_URL}/signup`,
        // @ts-ignore
        validate: async (request, session) => {
            const email = session.email;
            const { rows } = await pool.query(`SELECT * FROM users u WHERE u.email = $1`, [email]);
            if (rows[0]) {
                return { isValid: true, credentials: rows[0] };
            }
            return { isValid: false };
        },
    });
    server.auth.default("session");
    await testDbConnection();
    server.route({
        path: "/",
        method: "GET",
        options: {
            auth: false,
        },
        handler: (request, h) => {
            return "Backend is working";
        },
    });
    // Register the routes
    server.route(userRoutes);
    server.route(authRoutes);
    server.route(postRoute);
    await server.start();
};
// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    console.log(err);
    process.exit(1);
});
init();
