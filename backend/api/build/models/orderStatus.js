"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelOrderStatus = void 0;
const database_1 = __importDefault(require("../database"));
class ModelOrderStatus {
    async index() {
        try {
            const conn = await database_1.default.connect();
            const sql = 'SELECT * FROM order_status';
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
            const sql = 'SELECT * FROM order_status WHERE id=($1)';
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not find OrderStatus ${id}. Error: ${error.message}`);
        }
    }
    async create(os) {
        try {
            const sql = 'INSERT INTO order_status (status) VALUES($1) RETURNING *';
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [
                os.status
            ]);
            const OrderStatus = result.rows[0];
            conn.release();
            return OrderStatus;
        }
        catch (error) {
            throw new Error(`Could not add new OrderStatus ${os.status}. Error: ${error.message}`);
        }
    }
    async update(os) {
        try {
            const sql = 'UPDATE order_status \
                            SET status = $1 \
                            WHERE  id = $2 \
                            RETURNING *;';
            const conn = await database_1.default.connect();
            // request to DB
            const result = await conn.query(sql, [
                os.status,
                os.id
            ]);
            conn.release();
            const orderStatus = result.rows[0];
            return orderStatus;
        }
        catch (error) {
            throw new Error(`unable to update an order status ${os.status}: ${error.message}`);
        }
    }
    async delete(id) {
        try {
            const sql = 'DELETE FROM order_status WHERE id=($1)';
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [id]);
            const OrderStatus = result.rows[0];
            conn.release();
            return OrderStatus;
        }
        catch (error) {
            throw new Error(`Could not delete OrderStatus ${id}. Error: ${error.message}`);
        }
    }
}
exports.ModelOrderStatus = ModelOrderStatus;
