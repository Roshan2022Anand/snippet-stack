"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hapi_1 = __importDefault(require("@hapi/hapi"));
const connectDbTest_1 = __importDefault(require("./tests/connectDbTest"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const Cookie = require("hapi-auth-cookie");
// Create a new server instance
const init = async () => {
    const server = hapi_1.default.server({
        port: 5000,
        host: "localhost",
        routes: {
            cors: {
                origin: ["http://localhost:3000"],
                credentials: true,
            },
        },
    });
    // Register the cookie plugin
    await server.register(Cookie);
    server.auth.strategy("session", "cookie", {
        cookie: {
            name: "session",
            password: "passwordpasswordpasswordpassword",
            isSecure: false,
        },
        redirectTo: "http://localhost:3000/login",
        validateFunc: async ({ request, session }) => { },
    });
    server.auth.default("session");
    await (0, connectDbTest_1.default)();
    // Register the routes
    server.route(user_routes_1.default);
    server.route(auth_routes_1.default);
    await server.start();
};
// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    console.log(err);
    process.exit(1);
});
init();
