"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelProductCategory = void 0;
const database_1 = __importDefault(require("../database"));
class ModelProductCategory {
    async index() {
        try {
            const sql = 'SELECT * FROM product_category';
            const conn = await database_1.default.connect();
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (error) {
            throw new Error(`Could not get product categories. Error: ${error.message}`);
        }
    }
    async show(id) {
        try {
            const sql = `SELECT * FROM product_category WHERE id=${id}`;
            const conn = await database_1.default.connect();
            const result = (await conn.query(sql)).rows[0];
            conn.release();
            return result;
        }
        catch (error) {
            throw new Error(`Could not find Category ${id}. Error: ${error.message}`);
        }
    }
    async create(c) {
        try {
            const sql = `INSERT INTO product_category (category) VALUES('${c.category}') RETURNING *`;
            const conn = await database_1.default.connect();
            const result = await conn.query(sql);
            const Category = result.rows[0];
            conn.release();
            return Category;
        }
        catch (error) {
            throw new Error(`Could not add new Category ${c.category}. Error: ${error.message}`);
        }
    }
    async update(c) {
        try {
            const sql = `UPDATE product_category \
                            SET category = '${c.category}' \
                            WHERE  id = ${c.id} \
                            RETURNING *;`;
            const conn = await database_1.default.connect();
            // request to DB
            const result = await conn.query(sql);
            conn.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`unable to update a category ${c.category}: ${error.message}`);
        }
    }
    async delete(id) {
        try {
            const sql = `DELETE FROM product_category WHERE id=${id}`;
            const conn = await database_1.default.connect();
            const result = await conn.query(sql);
            const Category = result.rows[0];
            conn.release();
            return Category;
        }
        catch (error) {
            throw new Error(`Could not delete Category ${id}. Error: ${error.message}`);
        }
    }
}
exports.ModelProductCategory = ModelProductCategory;
