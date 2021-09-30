import client from '../database';

export interface OrderItem {
    id: number;
    product_id: number;
    quantity: number;
}

export interface Order {
    id: number;
    user_id: number;
    order_status_id: number;
    item: OrderItem[];
}

export class ModelOrder {

    async index(user_id: number, status?: number): Promise<Order[]> {
        try {
            // Generate SQL query
            const sql1 = 'SELECT * FROM order ';
            const sql2 = `WHERE order.user_id = ${user_id} `;
            let   sql3 = '';
            if (typeof status !== 'undefined') {
                sql3 = `AND order_status_id = ${status} `;
            }
            const sql4 = 'LEFT OUTER JOIN order_item \
                            ON order.id = order_item.order';

            // request to DB
            const conn = await client.connect();
            const result = await conn.query(sql1 + sql2 + sql3 + sql4);
            conn.release();

            return result.rows as Order[];
        } catch (error) {
            throw new Error(`Could not get orders. Error: ${(error as Error).message}`);
        }
    }

    async show(id: number): Promise<Order> {
        try {
            const sql = 'SELECT * FROM order \
                            LEFT OUTER JOIN order_item \
                            WHERE order.id=($id) \
                            ON order.id = order_item.order';

            const conn = await client.connect();
            const result = await conn.query(sql, [id]);
            conn.release();

            return result.rows[0] as Order;
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
            const sqlOrder = 'INSERT INTO order \
                                (user, order_status) \
                                VALUES($1, $2) RETURNING *';
            const createdOrder = (await conn.query(sqlOrder,
                                                    [
                                                        o.user_id,
                                                        o.order_status_id
                                                    ])).rows[0] as Order;

            // Create order items
            const sqlOrderItem = 'INSERT INTO order_item \
                                    (order, product, quantity) \
                                    VALUES($1, $2, $3) RETURNING *';
            o.item.forEach(item => {
                const orderitem = (item as unknown as OrderItem);
                conn.query(sqlOrderItem,
                    [
                        createdOrder.id,
                        orderitem.product_id,
                        orderitem.quantity
                    ])
                .then( resolve => {
                    console.log(resolve);
                })
                .catch( reject => {
                    throw new Error(reject);
                });
            });
            // end transaction
            await client.query("COMMIT")
            conn.release();

            return createdOrder;
        } catch (error) {
            await client.query("ROLLBACK");
            throw new Error(`Could not add new order for the user ${o.user_id}. Error: ${(error as Error).message}`)
        }
    }

    async update(o: Order): Promise<Order> {
        try {
            // DB query
            const conn = await client.connect();
            // start transaction
            await client.query("BEGIN")
            // Create an order
            const sqlOrder = 'UPDATE order \
                                SET order_status = $1 \
                                WHERE  order.id = $2 \
                                RETURNING *;'
            const updatedOrder = (await conn.query(sqlOrder,
                                                    [
                                                        o.user_id,
                                                        o.order_status_id
                                                    ])).rows[0] as Order;

            // To simplify delete and re-create order items
            // First delete
            const sqlOrderItemDelete = 'DELETE FROM order_item WHERE order=($1)';
            await conn.query(sqlOrderItemDelete, [o.id]);

            // then Create order items
            const sqlOrderItem = 'INSERT INTO order_item \
                                    (order, product, quantity) \
                                    VALUES($1, $2, $3) RETURNING *';
            o.item.forEach(item => {
                const orderitem = (item as unknown as OrderItem);
                conn.query(sqlOrderItem,
                            [
                                updatedOrder.id,
                                orderitem.product_id,
                                orderitem.quantity
                            ])
                .then( resolve => {
                    console.log(resolve);
                })
                .catch( reject => {
                    throw new Error(reject);
                });
            });

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
            const sqlOrder = 'DELETE FROM order WHERE id=($1)';
            const sqlOrderItem = 'DELETE FROM order_item WHERE order=($1)';

            // DB query
            const conn = await client.connect();
            // start transaction
            await client.query("BEGIN");
            // delete items
            await conn.query(sqlOrderItem, [id]);
            // delete order
            const resultOrder = await conn.query(sqlOrder, [id]);

            // end transaction
            await client.query("COMMIT")
            conn.release();

            return resultOrder.rows[0] as Order;
        } catch (error) {
            throw new Error(`Could not delete book ${id}. Error: ${(error as Error).message}`)
        }
    }
}

