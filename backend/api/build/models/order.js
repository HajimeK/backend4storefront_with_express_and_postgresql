"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelOrder = void 0;
const database_1 = __importDefault(require("../database"));
class ModelOrder {
    async index(user_id, status) {
        try {
            // Generate SQL query
            let sql = '';
            if (status !== undefined) {
                sql = `SELECT * FROM apporder WHERE appuser=${user_id} AND order_status=${status}`;
            }
            else {
                sql = `SELECT * FROM apporder WHERE appuser=${user_id}`;
            }
            // request to DB
            const conn = await database_1.default.connect();
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (error) {
            throw new Error(`Could not get orders. Error: ${error.message}`);
        }
    }
    async indexWithItems(user_id, status) {
        try {
            // Generate SQL query
            const sql1 = 'SELECT * FROM apporder ';
            const sql2 = `WHERE apporder.appuser = ${user_id} `;
            let sql3 = '';
            if (typeof status !== 'undefined') {
                sql3 = `AND order_status = ${status} `;
            }
            const sql4 = 'LEFT OUTER JOIN apporder_item \
                            ON order.id = apporder_item.apporder';
            // request to DB
            const conn = await database_1.default.connect();
            console.log(sql1 + sql2 + sql3 + sql4);
            const result = await conn.query(sql1 + sql2 + sql3 + sql4);
            conn.release();
            return result.rows;
        }
        catch (error) {
            throw new Error(`Could not get orders. Error: ${error.message}`);
        }
    }
    async show(id) {
        try {
            const sql = `SELECT * \
                            FROM apporder \
                            WHERE id=${id};`;
            const conn = await database_1.default.connect();
            const result = await conn.query(sql);
            conn.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not find order ${id}. Error: ${error.message}`);
        }
    }
    async create(o) {
        try {
            // DB query
            const conn = await database_1.default.connect();
            // start transaction
            await database_1.default.query("BEGIN");
            // Create an order
            const sqlOrder = `INSERT INTO apporder \
                                (appuser, order_status) \
                                VALUES(${o.appuser}, ${o.order_status}) RETURNING *`;
            const createdOrder = (await conn.query(sqlOrder)).rows[0];
            // end transaction
            await database_1.default.query("COMMIT");
            conn.release();
            return createdOrder;
        }
        catch (error) {
            await database_1.default.query("ROLLBACK");
            throw new Error(`Could not add new order for the user ${o.appuser}. Error: ${error.message}`);
        }
    }
    async update(o) {
        try {
            // DB query
            const conn = await database_1.default.connect();
            // start transaction
            await database_1.default.query("BEGIN");
            // Create an order
            const sqlOrder = `UPDATE apporder \
                                SET order_status = ${o.order_status} \
                                WHERE  apporder.id = ${o.id} \
                                RETURNING *;`;
            const updatedOrder = (await conn.query(sqlOrder)).rows[0];
            // end transaction
            await database_1.default.query("COMMIT");
            conn.release();
            return updatedOrder;
        }
        catch (error) {
            throw new Error(`unable to update an order ${o.id}: ${error.message}`);
        }
    }
    async delete(id) {
        try {
            const sqlOrder = `DELETE FROM apporder WHERE id=${id}`;
            // DB query
            const conn = await database_1.default.connect();
            // start transaction
            await database_1.default.query("BEGIN");
            // delete order
            const resultOrder = await conn.query(sqlOrder);
            // end transaction
            await database_1.default.query("COMMIT");
            conn.release();
            return resultOrder.rows[0];
        }
        catch (error) {
            throw new Error(`Could not delete an order ${id}. Error: ${error.message}`);
        }
    }
}
exports.ModelOrder = ModelOrder;
