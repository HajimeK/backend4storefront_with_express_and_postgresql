import client from '../database';

export type Product = {
    id: number,
    name: string,
    price: number,
    category?: number
};

export class ModelProduct {

    async index(category?: number, top?: boolean, num?: number): Promise<Product[]> {
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

    async show(id: number): Promise<Product> {
        try {
            const sql = 'SELECT * FROM product WHERE id=($1)';
            // @ts-ignore
            const conn = await Client.connect();
            const result = await conn.query(sql, [id]);
            conn.release();

            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not find product ${id}. Error: ${err}`);
        }
    }

    async create(p: Product): Promise<Product> {
        try {
            const sql = 'INSERT INTO product (name, price, category) VALUES($1, $2, $3) RETURNING *';
            // @ts-ignore
            const conn = await Client.connect();
            const result = await conn.query(sql, [p.name, p.price, p.category]);
            const Product = result.rows[0];
            conn.release();

            return Product;
        } catch (err) {
            throw new Error(`Could not add new book ${p.name}. Error: ${err}`)
        }
    }

    async update(p: Product): Promise<Product> {
        try {
            const sql = 'UPDATE product \
                            SET product_name = $1, \
                                price = $2, \
                                category = $3 \
                            WHERE  product.id = $4 \
                            RETURNING *;';

            const conn = await client.connect();
            // request to DB
            const result = await conn.query(sql,
                                            [
                                                p.name,
                                                p.price,
                                                p.category
                                            ]);
            conn.release();
            const product = result.rows[0];
            return product;
        } catch(error) {
            throw new Error(`unable to update a product ${p.name} ${p.price} ${p.category}: ${error}`);
        }
    }

    async delete(id: number): Promise<Product> {
        try {
            const sql = 'DELETE FROM product WHERE id=($1)';
            // @ts-ignore
            const conn = await Client.connect();
            const result = await conn.query(sql, [id]);
            const Product = result.rows[0];
            conn.release();

            return Product;
        } catch (err) {
            throw new Error(`Could not delete book ${id}. Error: ${err}`);
        }
    }
};