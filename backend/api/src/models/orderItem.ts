import client from '../database';

export interface OrderItem {
    id: number;
    apporder: number;
    product: number;
    quantity: number;
}

export class ModelOrderItem {

    async index(orderId: number): Promise<OrderItem[]> {
        try {
            // Generate SQL query
            const sql = `SELECT * FROM apporder_item WHERE apporder_item.apporder=${orderId}`;

            // request to DB
            const conn = await client.connect();
            const result = await conn.query(sql);
            conn.release();

            return result.rows as OrderItem[];
        } catch (error) {
            throw new Error(`Could not get orders. Error: ${(error as Error).message}`);
        }
    }


    async show(id: number): Promise<OrderItem> {
        try {
            const sql = `SELECT * \
                            FROM apporder_item \
                            WHERE apporder_item.id=${id};`;

            const conn = await client.connect();
            const orderItem = (await conn.query(sql)).rows[0] as OrderItem;
            conn.release();

            return orderItem;
        } catch (error) {
            throw new Error(`Could not find order ${id}. Error: ${(error as Error).message}`);
        }
    }

    async create(item: OrderItem): Promise<OrderItem> {
        try {
            // DB query
            const conn = await client.connect();
            // start transaction
            await client.query("BEGIN")
            // Create an order

            // Create order items
            const sqlOrderItem = `INSERT INTO apporder_item \
                                    (apporder, product, quantity) \
                                    VALUES(${item.apporder}, ${item.product}, ${item.quantity}) RETURNING *`;
            const createdItem = (await conn.query(sqlOrderItem)).rows[0] as OrderItem;
            // end transaction
            await client.query("COMMIT")
            conn.release();

            return createdItem;
        } catch (error) {
            await client.query("ROLLBACK");
            throw new Error(`Could not add new order items. Error: ${(error as Error).message}`)
        }
    }

    async update(oi: OrderItem): Promise<OrderItem> {
        try {
            // DB query
            const conn = await client.connect();
            // start transaction
            await client.query("BEGIN")
            const sql = `UPDATE apporder_item \
                            SET apporder = ${oi.apporder},
                                product = ${oi.product},
                                quantity = ${oi.quantity} \
                            WHERE  apporder_item.id = ${oi.id} \
                            RETURNING *;`

            const updatedItem = (await conn.query(sql)).rows[0] as OrderItem;

            // end transaction
            await client.query("COMMIT")
            conn.release();

            return updatedItem;
        } catch(error) {
            throw new Error(`unable to update an order item ${oi.id}: ${(error as Error).message}`);
        }
    }

    async delete(id: number): Promise<OrderItem> {
        try {
            const sql = `DELETE FROM apporder_item WHERE apporder_item.id=${id}`;

            // DB query
            const conn = await client.connect();
            await client.query("BEGIN");
            const resultOrder = (await conn.query(sql)).rows[0] as OrderItem;
            await client.query("COMMIT")
            conn.release();

            return resultOrder;
        } catch (error) {
            throw new Error(`Could not delete an order ${id}. Error: ${(error as Error).message}`)
        }
    }
}