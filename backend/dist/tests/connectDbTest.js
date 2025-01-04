"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbConfig_1 = __importDefault(require("../db/dbConfig"));
const testDbConnection = async () => {
    try {
        const client = await dbConfig_1.default.connect();
        client.release();
        return "Connected to the database";
    }
    catch (err) {
        return "Error connecting to the database";
    }
};
exports.default = testDbConnection;
