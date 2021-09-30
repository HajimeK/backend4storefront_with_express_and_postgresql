"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database"));
describe('Test Suite for database client', () => {
    let conn;
    it('connect to db', async () => {
        conn = await database_1.default.connect();
        expect(conn).not.toBeNull();
    });
    it('release db connection', () => {
        conn.release();
    });
});
