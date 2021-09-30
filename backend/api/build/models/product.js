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
            const sql1 = 'SELECT * FROM alias_product \
                            (SELECT * FROM product \
                                LEFT JOIN product_category ON product.category_id = product_category.id) AS alias_product';
            const sql2_topN = '';
            let sql3_category = '';
            if (typeof category !== 'undefined') {
                sql3_category = ` WHERE alias_product.category_id=${category}`;
            }
            if (typeof top !== 'undefined') {
                // let n = 5;
                // if(typeof num !== 'undefined'){
                //     n = num;
                // }
                // sql4_topN = " LIMIT ${n}";
                // //error until filtering implemented
                console.log(num);
                throw Error("not implemented");
            }
            // request to DB
            const conn = await database_1.default.connect();
            const result = await conn.query(sql1 + sql2_topN + sql3_category);
            conn.release();
            return result.rows;
        }
        catch (error) {
            throw new Error(`Could not get products. Error: ${error.message}`);
        }
    }
    async show(id) {
        try {
            const sql = `SELECT * FROM product WHERE id=${id}`;
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not find product ${id}. Error: ${error.message}`);
        }
    }
    async create(p) {
        try {
            let sql = '';
            if (p.category !== undefined) {
                sql = `INSERT INTO product (product_name, price, fk_category_id) VALUES(${p.name}, ${p.price}, ${p.category} RETURNING *;`;
            }
            else {
                sql = `INSERT INTO product (product_name, price, fk_category_id) VALUES(${p.name}, ${p.price} RETURNING *;`;
            }
            const conn = await database_1.default.connect();
            const result = await conn.query(sql);
            const Product = result.rows[0];
            conn.release();
            return Product;
        }
        catch (error) {
            throw new Error(`Could not add new product ${p.name}. Error: ${error.message}`);
        }
    }
    async update(p) {
        try {
            const sql = 'UPDATE product \
                            SET product_name = $1, \
                                price = $2, \
                                category = $3 \
                            WHERE  product.id = $4 \
                            RETURNING *;';
            const conn = await database_1.default.connect();
            // request to DB
            const result = await conn.query(sql, [
                p.name,
                p.price,
                p.category
            ]);
            conn.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`unable to update a product ${p.name} ${p.price} : ${error.message}`);
        }
    }
    async delete(id) {
        try {
            const sql = 'DELETE FROM product WHERE id=($1)';
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not delete product ${id}. Error: ${error.message}`);
        }
    }
}
exports.ModelProduct = ModelProduct;
