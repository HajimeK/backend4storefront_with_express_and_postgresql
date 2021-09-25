import { create } from 'domain';
import client from '../database';
import { OrderStatus, ModelOrderStatus } from './orderStatus';

export type OrderItem = {
    id: number,
    product_id: number,
    quantity: number,
};

export type Order = {
    id: number,
    user_id: number,
    order_status_id: number,
    item: OrderItem[]
}


export class ModelOrder {

    /*
Current Order by user (args: user id)[token required]
[OPTIONAL] Completed Orders by user (args: user id)[token required]
    */
    async index(user?: number, order_status?: string): Promise<Order[]> {
        try {
            // Generate SQL query
            const sql1 = 'SELECT product.id, product.product_name, product.price, product_category.category \
                        FROM product';
            let sql2_category = '';
            const sql3 = 'LEFT JOIN product_category ON product.category_id = product_category.id;';
            let sql4_topN = '';
            if (typeof category !== 'undefined') {
                sql2_category = ' WHERE product.id=${category}';
            }
            if(typeof top !== 'undefined') {
                let n = 5;
                if(typeof num !== 'undefined'){
                    n = num;
                }
                sql4_topN = " LIMIT ${n}";
                //error until filtering implemented
                throw Error("not implemented");
            }

            // request to DB
            const conn = await client.connect();
            const result = await conn.query(sql1 + sql2_category + sql3 + sql4_topN);
            conn.release();

            return result.rows;
        } catch (err) {
            throw new Error(`Could not get books. Error: ${err}`);
        }
    }

    async show(id: string): Promise<Order> {
        try {
            const sql = 'SELECT * FROM product WHERE id=($1)';

            const conn = await client.connect();
            const result = await conn.query(sql, [id]);
            conn.release();

            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not find product ${id}. Error: ${err}`);
        }
    }

    async create(o: Order, oi: OrderItem[]): Promise<Order> {
        try {
            // DB query
            const conn = await client.connect();
            // start transaction
            await client.query("BEGIN")
            // Create an order
            const sqlOrder = 'INSERT INTO order (user, order_status) VALUES($1, $2) RETURNING *';
            const createdOrder = await conn.query(sqlOrder,
                                                    [
                                                        o.user_id,
                                                        o.order_status_id
                                                    ]);

            // Create order items
            const sqlOrderItem = 'INSERT INTO order_item (order, product, quantity) \
                                    VALUES($1, $2, $3) RETURNING *';
            for (let item in oi) {
                const orderitem = (item as OrderItem);
                let resultItem = await conn.query(sqlOrderItem,
                                                    [
                                                        item.
                                                    ])

            }
            // end transaction
            await client.query("COMMIT")
            conn.release();

            return createdOrder.rows[0];
        } catch (err) {
            throw new Error(`Could not add new book ${pi.name}. Error: ${err}`)
        }
    }

    async delete(id: string): Promise<ProductItem> {
        try {
            const sql = 'DELETE FROM product WHERE id=($1)';
            // @ts-ignore
            const conn = await Client.connect();
            const result = await conn.query(sql, [id]);
            const productItem = result.rows[0];
            conn.release();

            return productItem;
        } catch (err) {
            throw new Error(`Could not delete book ${id}. Error: ${err}`)
        }
    }
};

