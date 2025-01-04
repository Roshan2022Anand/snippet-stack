"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbConfig_1 = __importDefault(require("../db/dbConfig"));
//Routes for all User operations
const UserRoutes = [
    //API endpoint to update the user details
    {
        path: "/api/user",
        method: "PUT",
        handler: async (request, h) => {
            try {
                const user = request.auth.credentials;
                const { name, bio, pic } = request.payload;
                //query to update the user details
                const { rowCount } = await dbConfig_1.default.query(`UPDATE users SET fname = '${name}', bio = '${bio}', pic = '${pic}' WHERE user_id = ${user.user_id}`);
                if (rowCount)
                    return h
                        .response({ message: "User Data Updated Successfully" })
                        .code(200);
                return h
                    .response({ message: "User Data Not Updated, Please try again" })
                    .code(400);
            }
            catch (err) {
                console.log(err);
                return h
                    .response({
                    error: "Something went wrong in server, Please update after sometimes",
                })
                    .code(500);
            }
        },
    },
    //API endpoint to delete the user
    {
        path: "/api/user",
        method: "DELETE",
        handler: async (request, h) => {
            try {
                const { user_id } = request.auth.credentials;
                const { rowCount } = await dbConfig_1.default.query(`DELETE FROM users WHERE user_id = ${user_id}`);
                //@ts-ignore
                request.cookieAuth.clear();
                if (rowCount)
                    return h
                        .response({ message: "Account Deleted succesfully" })
                        .code(200);
                return h.response({ error: "User Not Found" }).code(404);
            }
            catch (error) {
                console.log(error);
                return h.response({ error: "internal error" }).code(500);
            }
        },
    },
];
exports.default = UserRoutes;
