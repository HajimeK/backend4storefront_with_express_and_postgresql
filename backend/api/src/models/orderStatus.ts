import client from '../database'

export interface OrderStatus {
    id: number;
    order_status: string;
}

export class ModelOrderStatus {
    async index(): Promise<OrderStatus[]> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM order_status;';
            const result = await conn.query(sql);
            conn.release();

            return result.rows as OrderStatus[];
        } catch (error) {
            throw new Error(`Could not get order status. Error: ${(error as Error).message}`);
        }
    }

    async show(id: number): Promise<OrderStatus> {
        try {
            const sql = `SELECT * FROM order_status WHERE id=${id};`;

            const conn = await client.connect();
            const result = await conn.query(sql);
            conn.release();

            return result.rows[0] as OrderStatus;
        } catch (error) {
            throw new Error(`Could not find OrderStatus ${id}. Error: ${(error as Error).message}`);
        }
    }

    async create(os: OrderStatus): Promise<OrderStatus> {
        try {
            const sql = `INSERT INTO order_status (order_status) VALUES('${os.order_status}') RETURNING *;`;

            const conn = await client.connect();
            const result = await conn.query(sql);
            const OrderStatus = result.rows[0] as OrderStatus;
            conn.release();

            return OrderStatus;
        } catch (error) {
            throw new Error(`Could not add new OrderStatus ${os.order_status}. Error: ${(error as Error).message}`);
        }
    }

    async update(os: OrderStatus): Promise<OrderStatus> {
        try {
            const sql = `UPDATE order_status \
                            SET order_status='${os.order_status}' \
                            WHERE  order_status.id = ${os.id} \
                            RETURNING *;`;

            const conn = await client.connect();
            // request to DB
            const orderStatus = (await conn.query(sql)).rows[0] as OrderStatus;
            conn.release();

            return orderStatus;
        } catch(error) {
            throw new Error(`unable to update an order status ${os.order_status}: ${(error as Error).message}`);
        }
    }

    async delete(id: number): Promise<OrderStatus> {
        try {
            const sql = `DELETE FROM order_status WHERE id=${id}`;

            const conn = await client.connect();
            const result = await conn.query(sql);
            const OrderStatus = result.rows[0] as OrderStatus;
            conn.release();

            return OrderStatus;
        } catch (error) {
            throw new Error(`Could not delete OrderStatus ${id}. Error: ${(error as Error).message}`);
        }
    }
}