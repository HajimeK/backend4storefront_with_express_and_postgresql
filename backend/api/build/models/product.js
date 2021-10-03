"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelProduct = void 0;
const database_1 = __importDefault(require("../database"));
class ModelProduct {
    async index(category, top, num) {
        try {
            // Generate SQL query
            const sql1 = 'SELECT * FROM product';
            let sql3_category = '';
            if (category > 0) {
                sql3_category = ` WHERE category=${category};`;
            }
            if (typeof top !== 'undefined') {
                console.log(num);
                throw Error("not implemented");
            }
            const sql = sql1 + sql3_category;
            // request to DB
            console.log(sql);
            const conn = await database_1.default.connect();
            const products = (await conn.query(sql)).rows;
            conn.release();
            return products;
        }
        catch (error) {
            throw new Error(`Could not get products. Error: ${error.message}`);
        }
    }
    async show(id) {
        try {
            const sql = `SELECT * FROM product WHERE id=${id};`;
            const conn = await database_1.default.connect();
            const product = (await conn.query(sql)).rows[0];
            conn.release();
            return product;
        }
        catch (error) {
            throw new Error(`Could not find product ${id}. Error: ${error.message}`);
        }
    }
    async create(p) {
        try {
            let sql = '';
            if (p.category !== undefined) {
                sql = `INSERT INTO product (product_name, price, category) VALUES('${p.product_name}', ${p.price}, ${p.category}) RETURNING *;`;
            }
            else {
                sql = `INSERT INTO product (product_name, price, category) VALUES('${p.product_name}', ${p.price}) RETURNING *;`;
            }
            const conn = await database_1.default.connect();
            const result = await conn.query(sql);
            const Product = result.rows[0];
            conn.release();
            return Product;
        }
        catch (error) {
            throw new Error(`Could not add new product ${p.product_name}. Error: ${error.message}`);
        }
    }
    async update(p) {
        try {
            let sql = '';
            if (p.category !== undefined) {
                sql = `UPDATE product \
                            SET product_name = '${p.product_name}', \
                                price = ${p.price}, \
                                category = ${p.category} \
                            WHERE  product.id = ${p.id} \
                            RETURNING *`;
            }
            else {
                sql = `UPDATE product \
                            SET product_name = '${p.product_name}', \
                                price = ${p.price} \
                            WHERE  product.id = ${p.id} \
                            RETURNING *`;
            }
            const conn = await database_1.default.connect();
            // request to DB
            const result = await conn.query(sql);
            conn.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`unable to update a product ${p.product_name} ${p.price} : ${error.message}`);
        }
    }
    async delete(id) {
        try {
            const sql = `DELETE FROM product WHERE id=${id} RETURNING *`;
            const conn = await database_1.default.connect();
            const result = await conn.query(sql);
            conn.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not delete product ${id}. Error: ${error.message}`);
        }
    }
}
exports.ModelProduct = ModelProduct;
