import client from '../database';

export type Product = {
    id: number,
    name: string,
    price: number,
    category?: string
};

export class ModelProduct {

    /*
    * /products?top=<true | false>&num=<number(default 5)>?category=<catetory>
    *
    * @param {boolean} top: [Optional]true to get top. If not specified
    * @param {number} num: [Optional] Only work with top.The numbe of items to get. Default value is 5.
    * @param {string} category: [Optional] the product category. The category should match that are stored in the category table.
    * @return {json array} list of products
    *        [ id :{
    *                  product_name: <{string} product name>,
    *                  price: <{number} >
    *              },
    *           ...]
    */
    async index(category?: string, top?: boolean, num?: number): Promise<Product[]> {
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

    async show(id: string): Promise<Product> {
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

    async delete(id: string): Promise<Product> {
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