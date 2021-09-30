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
            const sql1 = 'SELECT * FROM order ';
            const sql2 = `WHERE order.user_id = ${user_id} `;
            let sql3 = '';
            if (typeof status !== 'undefined') {
                sql3 = `AND order_status_id = ${status} `;
            }
            const sql4 = 'LEFT OUTER JOIN order_item \
                            ON order.id = order_item.order';
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
            const sql = 'SELECT * FROM order \
                            LEFT OUTER JOIN order_item \
                            WHERE order.id=($id) \
                            ON order.id = order_item.order';
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
            const sqlOrder = 'INSERT INTO order \
                                (user, order_status) \
                                VALUES($1, $2) RETURNING *';
            const createdOrder = (await conn.query(sqlOrder, [
                o.user_id,
                o.order_status_id
            ])).rows[0];
            // Create order items
            const sqlOrderItem = 'INSERT INTO order_item \
                                    (order, product, quantity) \
                                    VALUES($1, $2, $3) RETURNING *';
            o.item.forEach(item => {
                const orderitem = item;
                conn.query(sqlOrderItem, [
                    createdOrder.id,
                    orderitem.product_id,
                    orderitem.quantity
                ])
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
            const sqlOrder = 'UPDATE order \
                                SET order_status = $1 \
                                WHERE  order.id = $2 \
                                RETURNING *;';
            const updatedOrder = (await conn.query(sqlOrder, [
                o.user_id,
                o.order_status_id
            ])).rows[0];
            // To simplify delete and re-create order items
            // First delete
            const sqlOrderItemDelete = 'DELETE FROM order_item WHERE order=($1)';
            await conn.query(sqlOrderItemDelete, [o.id]);
            // then Create order items
            const sqlOrderItem = 'INSERT INTO order_item \
                                    (order, product, quantity) \
                                    VALUES($1, $2, $3) RETURNING *';
            o.item.forEach(item => {
                const orderitem = item;
                conn.query(sqlOrderItem, [
                    updatedOrder.id,
                    orderitem.product_id,
                    orderitem.quantity
                ])
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
            const sqlOrder = 'DELETE FROM order WHERE id=($1)';
            const sqlOrderItem = 'DELETE FROM order_item WHERE order=($1)';
            // DB query
            const conn = await database_1.default.connect();
            // start transaction
            await database_1.default.query("BEGIN");
            // delete items
            await conn.query(sqlOrderItem, [id]);
            // delete order
            const resultOrder = await conn.query(sqlOrder, [id]);
            // end transaction
            await database_1.default.query("COMMIT");
            conn.release();
            return resultOrder.rows[0];
        }
        catch (error) {
            throw new Error(`Could not delete book ${id}. Error: ${error.message}`);
        }
    }
}
exports.ModelOrder = ModelOrder;
