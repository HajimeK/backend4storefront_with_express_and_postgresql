import client from '../database';

export interface Order {
    id: number;
    appuser: number;
    order_status: number;
}

export class ModelOrder {

    async index(user_id: number, status?: number): Promise<Order[]> {
        try {
            // Generate SQL query
            let sql = '';
            if(status!== undefined) {
                sql = `SELECT * FROM apporder WHERE appuser=${user_id} AND order_status=${status}`;
            } else {
                sql = `SELECT * FROM apporder WHERE appuser=${user_id}`;
            }

            // request to DB
            const conn = await client.connect();
            const orders = (await conn.query(sql)).rows as Order[];
            conn.release();

            return orders;
        } catch (error) {
            throw new Error(`Could not get orders. Error: ${(error as Error).message}`);
        }
    }

    async indexWithItems(user_id: number, status?: number): Promise<Order[]> {
        try {
            // Generate SQL query
            const sql1 = 'SELECT * FROM apporder ';
            const sql2 = `WHERE apporder.appuser = ${user_id} `;
            let   sql3 = '';
            if (typeof status !== 'undefined') {
                sql3 = `AND order_status = ${status} `;
            }
            const sql4 = 'LEFT OUTER JOIN apporder_item \
                            ON order.id = apporder_item.apporder';

            // request to DB
            const conn = await client.connect();
            console.log(sql1 + sql2 + sql3 + sql4);
            const result = await conn.query(sql1 + sql2 + sql3 + sql4);
            conn.release();

            return result.rows as Order[];
        } catch (error) {
            throw new Error(`Could not get orders. Error: ${(error as Error).message}`);
        }
    }


    async show(id: number): Promise<Order> {
        try {
            const sql = `SELECT * \
                            FROM apporder \
                            WHERE id=${id};`;

            const conn = await client.connect();
            const order = (await conn.query(sql)).rows[0] as Order;
            conn.release();

            return order;
        } catch (error) {
            throw new Error(`Could not find order ${id}. Error: ${(error as Error).message}`);
        }
    }

    async create(o: Order): Promise<Order> {
        try {
            // DB query
            const conn = await client.connect();
            // start transaction
            await client.query("BEGIN")
            // Create an order
            const sqlOrder = `INSERT INTO apporder \
                                (appuser, order_status) \
                                VALUES(${o.appuser}, ${o.order_status}) RETURNING *`;
            const createdOrder = (await conn.query(sqlOrder)).rows[0] as Order;

             // end transaction
            await client.query("COMMIT")
            conn.release();

            return createdOrder;
        } catch (error) {
            await client.query("ROLLBACK");
            throw new Error(`Could not add new order for the user ${o.appuser}. Error: ${(error as Error).message}`)
        }
    }

    async update(o: Order): Promise<Order> {
        try {
            // DB query
            const conn = await client.connect();
            // start transaction
            await client.query("BEGIN")
            // Create an order
            const sqlOrder = `UPDATE apporder \
                                SET order_status = ${o.order_status} \
                                WHERE  apporder.id = ${o.id} \
                                RETURNING *;`
            const updatedOrder = (await conn.query(sqlOrder)).rows[0] as Order;

            // end transaction
            await client.query("COMMIT")
            conn.release();

            return updatedOrder;
        } catch(error) {
            throw new Error(`unable to update an order ${o.id}: ${(error as Error).message}`);
        }
    }

    async delete(id: number): Promise<Order> {
        try {
            const sqlOrder = `DELETE FROM apporder WHERE id=${id}`;

            // DB query
            const conn = await client.connect();
            // start transaction
            await client.query("BEGIN");
            // delete order
            const resultOrder = await conn.query(sqlOrder);

            // end transaction
            await client.query("COMMIT")
            conn.release();

            return resultOrder.rows[0] as Order;
        } catch (error) {
            throw new Error(`Could not delete an order ${id}. Error: ${(error as Error).message}`)
        }
    }
}

