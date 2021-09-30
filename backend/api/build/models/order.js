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
            const sql1 = 'SELECT * FROM apporder ';
            const sql2 = `WHERE apporder.fk_appuser_id = ${user_id} `;
            let sql3 = '';
            if (typeof status !== 'undefined') {
                sql3 = `AND fk_order_status_id = ${status} `;
            }
            const sql4 = 'LEFT OUTER JOIN apporder_item \
                            ON order.id = apporder_item.fk_order_id';
            // request to DB
            const conn = await database_1.default.connect();
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
            const sql = `SELECT * FROM \
                            ( \
                                SELECT * FROM apporder \
                                LEFT OUTER JOIN apporder_item \
                                ON (apporder.id = apporder_item.fk_order_id) \
                            ) AS alias_order \
                            WHERE alias_order.id=${id};`;
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [id]);
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
                                (fk_appuser_id, fk_order_status_id) \
                                VALUES(${o.user_id}, ${o.order_status_id}) RETURNING *`;
            const createdOrder = (await conn.query(sqlOrder)).rows[0];
            // Create order items
            o.item.forEach(item => {
                const orderitem = item;
                const sqlOrderItem = `INSERT INTO apporder_item \
                                        (fk_order_id, fk_product_id, quantity) \
                                        VALUES(${createdOrder.id}, ${orderitem.product_id}, ${orderitem.quantity}) RETURNING *`;
                conn.query(sqlOrderItem)
                    .then(resolve => {
                    console.log(resolve);
                })
                    .catch(reject => {
                    throw new Error(reject);
                });
            });
            // end transaction
            await database_1.default.query("COMMIT");
            conn.release();
            return createdOrder;
        }
        catch (error) {
            await database_1.default.query("ROLLBACK");
            throw new Error(`Could not add new order for the user ${o.user_id}. Error: ${error.message}`);
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
                                SET fk_order_status_id = ${o.user_id} \
                                WHERE  apporder.id = ${o.order_status_id} \
                                RETURNING *;`;
            const updatedOrder = (await conn.query(sqlOrder)).rows[0];
            // To simplify delete and re-create order items
            // First delete
            const sqlOrderItemDelete = 'DELETE FROM apporder_item WHERE fk_order_id=($1)';
            await conn.query(sqlOrderItemDelete, [o.id]);
            // then Create order items
            o.item.forEach(item => {
                const orderitem = item;
                const sqlOrderItem = `INSERT INTO apporder_item \
                                        (fk_order_id, fk_product_id, quantity) \
                                        VALUES(${updatedOrder.id}, ${orderitem.product_id}, ${orderitem.quantity}) RETURNING *`;
                conn.query(sqlOrderItem)
                    .then(resolve => {
                    console.log(resolve);
                })
                    .catch(reject => {
                    throw new Error(reject);
                });
            });
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
            const sqlOrderItem = `DELETE FROM apporder_item WHERE fk_order_id=${id}`;
            // DB query
            const conn = await database_1.default.connect();
            // start transaction
            await database_1.default.query("BEGIN");
            // delete items
            await conn.query(sqlOrderItem);
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
