import client from '../database'

export interface OrderStatus {
    id: number;
    status: string;
}

export class ModelOrderStatus {
    async index(): Promise<OrderStatus[]> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM order_status';
            const result = await conn.query(sql);
            conn.release();

            return result.rows as OrderStatus[];
        } catch (error) {
            throw new Error(`Could not get product categories. Error: ${(error as Error).message}`);
        }
    }

    async show(id: number): Promise<OrderStatus> {
        try {
            const sql = 'SELECT * FROM order_status WHERE id=($1)';

            const conn = await client.connect();
            const result = await conn.query(sql, [id]);
            conn.release();

            return result.rows[0] as OrderStatus;
        } catch (error) {
            throw new Error(`Could not find OrderStatus ${id}. Error: ${(error as Error).message}`);
        }
    }

    async create(os: OrderStatus): Promise<OrderStatus> {
        try {
            const sql = 'INSERT INTO order_status (status) VALUES($1) RETURNING *';

            const conn = await client.connect();
            const result = await conn.query(sql,
                                            [
                                                os.status
                                            ]);
            const OrderStatus = result.rows[0] as OrderStatus;
            conn.release();

            return OrderStatus;
        } catch (error) {
            throw new Error(`Could not add new OrderStatus ${os.status}. Error: ${(error as Error).message}`);
        }
    }

    async update(os: OrderStatus): Promise<OrderStatus> {
        try {
            const sql = 'UPDATE order_status \
                            SET status = $1 \
                            WHERE  id = $2 \
                            RETURNING *;';

            const conn = await client.connect();
            // request to DB
            const result = await conn.query(sql,
                                            [
                                                os.status,
                                                os.id
                                            ]);
            conn.release();

            const orderStatus = result.rows[0] as OrderStatus;
            return orderStatus;
        } catch(error) {
            throw new Error(`unable to update an order status ${os.status}: ${(error as Error).message}`);
        }
    }

    async delete(id: number): Promise<OrderStatus> {
        try {
            const sql = 'DELETE FROM order_status WHERE id=($1)';

            const conn = await client.connect();
            const result = await conn.query(sql, [id]);
            const OrderStatus = result.rows[0] as OrderStatus;
            conn.release();

            return OrderStatus;
        } catch (error) {
            throw new Error(`Could not delete OrderStatus ${id}. Error: ${(error as Error).message}`);
        }
    }
}