import client from '../database';

export interface Product {
    id: number;
    product_name: string;
    price: number;
    category?: number;
}

export class ModelProduct {

    async index(category: number, top?: boolean, num?: number): Promise<Product[]> {
        try {
            // Generate SQL query
            const sql1 = 'SELECT * FROM product';
            let sql3_category = '';
            if(category > 0) {
                sql3_category = ` WHERE category=${category};`;
            }

            if(typeof top !== 'undefined') {
                console.log(num);
                throw Error("not implemented");
            }
            const sql = sql1 + sql3_category;

            // request to DB
            console.log(sql);
            const conn = await client.connect();
            const products = (await conn.query(sql)).rows as Product[];
            conn.release();

            return products;
        } catch (error) {
            throw new Error(`Could not get products. Error: ${(error as Error).message}`);
        }
    }

    async show(id: number): Promise<Product> {
        try {
            const sql = `SELECT * FROM product WHERE id=${id};`;

            const conn = await client.connect();
            const product = (await conn.query(sql)).rows[0] as Product;
            conn.release();

            return product;
        } catch (error) {
            throw new Error(`Could not find product ${id}. Error: ${(error as Error).message}`);
        }
    }

    async create(p: Product): Promise<Product> {
        try {
            let sql = '';
            if(p.category!== undefined) {
                sql = `INSERT INTO product (product_name, price, category) VALUES('${p.product_name}', ${p.price}, ${p.category}) RETURNING *;`;
            } else {
                sql = `INSERT INTO product (product_name, price, category) VALUES('${p.product_name}', ${p.price}) RETURNING *;`;
            }

            const conn = await client.connect();
            const result = await conn.query(sql);
            const Product = result.rows[0] as Product;
            conn.release();

            return Product;
        } catch (error) {
            throw new Error(`Could not add new product ${p.product_name}. Error: ${(error as Error).message}`)
        }
    }

    async update(p: Product): Promise<Product> {
        try {
            let sql = '';
            if(p.category!== undefined) {
                sql = `UPDATE product \
                            SET product_name = '${p.product_name}', \
                                price = ${p.price}, \
                                category = ${p.category} \
                            WHERE  product.id = ${p.id} \
                            RETURNING *`;
            } else {
                sql = `UPDATE product \
                            SET product_name = '${p.product_name}', \
                                price = ${p.price} \
                            WHERE  product.id = ${p.id} \
                            RETURNING *`;
            }

            const conn = await client.connect();
            // request to DB
            const result = await conn.query(sql);
            conn.release();

            return result.rows[0] as Product;
        } catch(error) {
            throw new Error(`unable to update a product ${p.product_name} ${p.price} : ${(error as Error).message}`);
        }
    }

    async delete(id: number): Promise<Product> {
        try {
            const sql = `DELETE FROM product WHERE id=${id} RETURNING *`;

            const conn = await client.connect();
            const result = await conn.query(sql);
            conn.release();

            return result.rows[0] as Product;
        } catch (error) {
            throw new Error(`Could not delete product ${id}. Error: ${(error as Error).message}`);
        }
    }
}