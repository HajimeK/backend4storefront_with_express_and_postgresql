"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("../database"));
dotenv_1.default.config();
const { BCRYPT_PASSWORD, SALT_ROUNDS, } = process.env;
class ModelUser {
    async index() {
        try {
            // Generate SQL query
            const sql = 'SELECT appuser.id, appuser.email. appuser.firstname, appuser.lastname \
                        FROM appuser;';
            // request to DB
            const conn = await database_1.default.connect();
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (error) {
            throw new Error(`Could not get users. Error: ${error.message}`);
        }
    }
    async show(id) {
        try {
            const sql = `SELECT appuser.id, appuser.email. appuser.firstname, appuser.lastname \
                            FROM appuser \
                            WHERE id=${id};`;
            // request to DB
            const conn = await database_1.default.connect();
            const result = await conn.query(sql);
            conn.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not find a user ${id}. Error: ${error.message}`);
        }
    }
    async create(u) {
        try {
            const conn = await database_1.default.connect();
            const hash = bcrypt_1.default.hashSync(u.password + BCRYPT_PASSWORD, Number(SALT_ROUNDS));
            const sql = `INSERT INTO appuser (email, firstname, lastname, userpassword ) \
                        VALUES(${u.email}, ${u.firstName}, ${u.lastName}, ${hash}) RETURNING *;`;
            // request to DB
            const result = await conn.query(sql);
            const user = result.rows[0];
            conn.release();
            return user;
        }
        catch (error) {
            throw new Error(`unable to create a uer ${u.lastName}, ${u.firstName}: ${error.message}`);
        }
    }
    async update(u) {
        try {
            const conn = await database_1.default.connect();
            const hash = bcrypt_1.default.hashSync(u.password + process.env.BCRYPT_PASSWORD, Number(process.env.SALT_ROUND));
            const sql = `UPDATE appuser \
                            SET email = ${u.email}, \
                                firstname   = ${u.firstName} \
                                lastname = ${u.lastName} \
                                userpassword = ${hash}; \
                            WHERE  appuser.id = ${u.id} \
                            RETURNING *;`;
            // request to DB
            const result = await conn.query(sql);
            const user = result.rows[0];
            conn.release();
            return user;
        }
        catch (error) {
            throw new Error(`unable to create a uer ${u.lastName}, ${u.firstName}: ${error.message}`);
        }
    }
    async delete(id) {
        try {
            const sql = `DELETE FROM appuser WHERE id=${id}`;
            // request to DB
            const conn = await database_1.default.connect();
            const result = await conn.query(sql);
            const user = result.rows[0];
            conn.release();
            return user;
        }
        catch (error) {
            throw new Error(`Could not delete user ${id}. Error: ${error.message}`);
        }
    }
    async authenticate(email, password) {
        const sql = `SELECT password FROM appuser WHERE email=${email}`;
        const conn = await database_1.default.connect();
        const result = await conn.query(sql);
        conn.release();
        if (result.rows.length) {
            const user = result.rows[0];
            console.log(user);
            if (bcrypt_1.default.compareSync(password + process.env.BCRYPT_PASSWORD, user.password)) {
                return user;
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    }
}
exports.ModelUser = ModelUser;
