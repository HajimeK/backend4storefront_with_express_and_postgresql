import client from '../database'

export interface OrderStatus {
    id: number;
    status: string;
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
            const sql = `INSERT INTO order_status (order_status) VALUES(${os.status}) RETURNING *;`;

            const conn = await client.connect();
            const result = await conn.query(sql);
            const OrderStatus = result.rows[0] as OrderStatus;
            conn.release();

            return OrderStatus;
        } catch (error) {
            throw new Error(`Could not add new OrderStatus ${os.status}. Error: ${(error as Error).message}`);
        }
    }

    async update(os: OrderStatus): Promise<OrderStatus> {
        try {
            const sql = `UPDATE order_status \
                            SET order_status = ${os.status} \
                            WHERE  id = ${os.id} \
                            RETURNING *;`;

            const conn = await client.connect();
            // request to DB
            const result = await conn.query(sql);
            conn.release();

            const orderStatus = result.rows[0] as OrderStatus;
            return orderStatus;
        } catch(error) {
            throw new Error(`unable to update an order status ${os.status}: ${(error as Error).message}`);
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