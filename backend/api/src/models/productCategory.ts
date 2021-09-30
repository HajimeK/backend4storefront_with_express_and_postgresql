import client from '../database'

export interface  ProductCategory {
    id: number;
    category: string;
}

export class ModelProductCategory {
    async index(): Promise<ProductCategory[]> {
        try {
            const sql = 'SELECT * FROM product_category';
            const conn = await client.connect();
            const result = await conn.query(sql);
            conn.release();

            return result.rows as ProductCategory[];
        } catch (error) {
            throw new Error(`Could not get product categories. Error: ${(error as Error).message}`);
        }
    }

    async show(id: number): Promise<ProductCategory> {
        try {
            const sql = 'SELECT * FROM product_category WHERE id=($1)';
            const conn = await client.connect();
            const result = await conn.query(sql, [id]);
            conn.release();

            return result.rows[0] as ProductCategory;
        } catch (error) {
            throw new Error(`Could not find Category ${id}. Error: ${(error as Error).message}`);
        }
    }

    async create(c: ProductCategory): Promise<ProductCategory> {
        try {
            const sql = 'INSERT INTO product_category (category) VALUES($1) RETURNING *';
            const conn = await client.connect()

            const result = await conn.query(sql, [c.category]);
            const Category = result.rows[0] as ProductCategory;
            conn.release();

            return Category;
        } catch (error) {
            throw new Error(`Could not add new Category ${c.category}. Error: ${(error as Error).message}`);
        }
    }

    async update(c: ProductCategory): Promise<ProductCategory> {
        try {
            const sql = 'UPDATE product_category \
                            SET category = $1 \
                            WHERE  id = $2 \
                            RETURNING *;';

            const conn = await client.connect();
            // request to DB
            const result = await conn.query(sql,
                                            [
                                                c.category,
                                                c.id
                                            ]);
            conn.release();

            return result.rows[0] as ProductCategory;
        } catch(error) {
            throw new Error(`unable to update a category ${c.category}: ${(error as Error).message}`);
        }
    }

    async delete(id: number): Promise<ProductCategory> {
        try {
            const sql = 'DELETE FROM product_category WHERE id=($1)';
            const conn = await client.connect();
            const result = await conn.query(sql,
                                            [
                                                id
                                            ]);
            const Category = result.rows[0] as ProductCategory;
            conn.release();

            return Category;
        } catch (error) {
            throw new Error(`Could not delete Category ${id}. Error: ${(error as Error).message}`);
        }
    }
}