// @ts-ignore
import Client from '../database'

export type OrderStatus = {
    id: number;
    status: string;
}

export class ModelOrderStatus {
    async index(): Promise<OrderStatus[]> {
        try {
            const conn = await Client.connect();
            const sql = 'SELECT * FROM order_status';
            const result = await conn.query(sql);
            conn.release();

            return result.rows;
        } catch (err) {
            throw new Error(`Could not get product categories. Error: ${err}`);
        }
    }

    async show(id: number): Promise<OrderStatus> {
        try {
            const sql = 'SELECT * FROM order_status WHERE id=($1)';

            const conn = await Client.connect();
            const result = await conn.query(sql, [id]);
            conn.release();

            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not find OrderStatus ${id}. Error: ${err}`);
        }
    }

    async create(os: OrderStatus): Promise<OrderStatus> {
        try {
            const sql = 'INSERT INTO order_status (status) VALUES($1) RETURNING *';

            const conn = await Client.connect();
            const result = await conn.query(sql,
                                            [
                                                os.status
                                            ]);
            const OrderStatus = result.rows[0];
            conn.release();

            return OrderStatus;
        } catch (err) {
            throw new Error(`Could not add new OrderStatus ${os.status}. Error: ${err}`);
        }
    }

    async update(os: OrderStatus): Promise<OrderStatus> {
        try {
            const sql = 'UPDATE order_status \
                            SET status = $1 \
                            WHERE  id = $2 \
                            RETURNING *;';

            const conn = await Client.connect();
            // request to DB
            const result = await conn.query(sql,
                                            [
                                                os.status,
                                                os.id
                                            ]);
            conn.release();

            const orderStatus = result.rows[0];
            return orderStatus;
        } catch(error) {
            throw new Error(`unable to update an order status ${os.status}: ${error}`);
        }
    }

    async delete(id: number): Promise<OrderStatus> {
        try {
            const sql = 'DELETE FROM order_status WHERE id=($1)';

            const conn = await Client.connect();
            const result = await conn.query(sql, [id]);
            const OrderStatus = result.rows[0];
            conn.release();

            return OrderStatus;
        } catch (err) {
            throw new Error(`Could not delete OrderStatus ${id}. Error: ${err}`);
        }
    }
}