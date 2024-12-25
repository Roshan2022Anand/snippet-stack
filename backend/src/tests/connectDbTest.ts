import pool from "../configs/dbConfig";

const testDbConnection = async () => {
  try {
    const client = await pool.connect();
    client.release();
    return "Connected to the database";
  } catch (err) {
    return "Error connecting to the database";
  }
};

export default testDbConnection;
