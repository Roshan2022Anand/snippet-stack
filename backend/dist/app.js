"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connectDbTest_1 = __importDefault(require("./tests/connectDbTest"));
const dbConfig_1 = __importDefault(require("./db/dbConfig"));
const postUtils_routes_1 = __importDefault(require("./routes/postUtils.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const post_routes_1 = __importDefault(require("./routes/post.routes"));
const Cookie = require("@hapi/cookie");
const Hapi = require("@hapi/hapi");
const init = async () => {
    // Defining the server configuration with CORS
    const server = Hapi.server({
        port: process.env.PORT || 5000,
        host: "0.0.0.0",
        routes: {
            cors: {
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
            isSecure: process.env.NODE_ENV === "production",
            ttl: 24 * 60 * 60 * 1000,
            path: "/",
            isSameSite: "None",
            isHttpOnly: true,
        },
        redirectTo: `${process.env.FRONTEND_URL}/signup`,
        // @ts-ignore
        validate: async (request, session) => {
            const email = session.email;
            const { rows } = await dbConfig_1.default.query(`SELECT * FROM users u WHERE u.email = $1`, [email]);
            if (rows[0]) {
                return { isValid: true, credentials: rows[0] };
            }
            return { isValid: false };
        },
    });
    server.auth.default("session");
    await (0, connectDbTest_1.default)();
    //entry point to check if server is running
    server.route({
        path: "/",
        method: "GET",
        options: {
            auth: false,
        },
        handler: () => {
            return "Server is running! into hell";
        },
    });
    // Register the routes
    server.route(user_routes_1.default);
    server.route(auth_routes_1.default);
    server.route(post_routes_1.default);
    server.route(postUtils_routes_1.default);
    await server.start();
};
// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    console.log(err);
    process.exit(1);
});
init();
