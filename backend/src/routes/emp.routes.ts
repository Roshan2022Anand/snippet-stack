import { ServerRoute } from "@hapi/hapi";
import pool from "../configs/dbConfig";

const empRoutes: ServerRoute[] = [
  {
    method: "GET",
    path: "/emp/read",
    handler: async (request, h) => {
      try {
        const res = await pool.query("SELECT * FROM emp");
        return res.rows;
      } catch (err) {
        console.log(err);
        return "Error reading employee data";
      }
    },
  },
];

export default empRoutes;
