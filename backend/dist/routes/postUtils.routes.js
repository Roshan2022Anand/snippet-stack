"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbConfig_1 = __importDefault(require("../db/dbConfig"));
const PostUtilsRoutes = [
    //route to update the value of the vote
    {
        path: "/api/vote",
        method: "PUT",
        handler: async (request, h) => {
            try {
                const { user_id } = request.auth.credentials;
                const { voteType, post_id } = request.payload;
                const { rows } = await dbConfig_1.default.query(`SELECT * FROM votes WHERE user_id = $1 AND post_id = $2`, [user_id, post_id]);
                //if the user have already voted then update the vote
                if (rows.length > 0)
                    await dbConfig_1.default.query(`UPDATE votes SET vote_type = $1 WHERE user_id = $2 AND post_id = $3`, [voteType, user_id, post_id]);
                else
                    await dbConfig_1.default.query(`INSERT INTO votes (user_id, post_id, vote_type) VALUES ($1, $2, $3)`, [user_id, post_id, voteType]);
                //return the total votes
                const res = await dbConfig_1.default.query(`SELECT 
            SUM(CASE WHEN vote_type THEN 1 ELSE 0 END) AS up_votes,
            SUM(CASE WHEN NOT vote_type THEN 1 ELSE 0 END) AS down_votes
            FROM votes 
            WHERE post_id = $1`, [post_id]);
                const { up_votes, down_votes } = res.rows[0];
                return h
                    .response({ message: "voted successfully", up_votes, down_votes })
                    .code(200);
            }
            catch (err) {
                console.log(err);
                return h
                    .response({ error: "Internal Server Error, please try again" })
                    .code(500);
            }
        },
    },
    //route to add a comment
];
exports.default = PostUtilsRoutes;
