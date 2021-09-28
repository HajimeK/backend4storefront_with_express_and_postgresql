// @ts-ignore
import Client from '../database'

export type ProductCategory = {
    id: number;
    category: string;
}

export class ModelProductCategory {
    async index(): Promise<ProductCategory[]> {
        try {
            const sql = 'SELECT * FROM product_category';
            const conn = await Client.connect();
            const result = await conn.query(sql);
            conn.release();

            return result.rows;
        } catch (err) {
            throw new Error(`Could not get product categories. Error: ${err}`);
        }
    }

    async show(id: number): Promise<ProductCategory> {
        try {
            const sql = 'SELECT * FROM product_category WHERE id=($1)';
            const conn = await Client.connect();
            const result = await conn.query(sql, [id]);
            conn.release();

            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not find Category ${id}. Error: ${err}`);
        }
    }

    async create(c: ProductCategory): Promise<ProductCategory> {
        try {
            const sql = 'INSERT INTO product_category (category) VALUES($1) RETURNING *';            const conn = await Client.connect()

            const result = await conn.query(sql, [c.category]);
            const Category = result.rows[0];
            conn.release();

            return Category;
        } catch (err) {
            throw new Error(`Could not add new Category ${c.category}. Error: ${err}`);
        }
    }

    async update(c: ProductCategory): Promise<ProductCategory> {
        try {
            const sql = 'UPDATE product_category \
                            SET category = $1 \
                            WHERE  id = $2 \
                            RETURNING *;';

            const conn = await Client.connect();
            // request to DB
            const result = await conn.query(sql,
                                            [
                                                c.category,
                                                c.id
                                            ]);
            conn.release();

            const user = result.rows[0];
            return user;
        } catch(error) {
            throw new Error(`unable to update a category ${c.category}: ${error}`);
        }
    }

    async delete(id: number): Promise<ProductCategory> {
        try {
            const sql = 'DELETE FROM product_category WHERE id=($1)';
            const conn = await Client.connect();
            const result = await conn.query(sql,
                                            [
                                                id
                                            ]);
            const Category = result.rows[0];
            conn.release();

            return Category;
        } catch (err) {
            throw new Error(`Could not delete Category ${id}. Error: ${err}`);
        }
    }
}