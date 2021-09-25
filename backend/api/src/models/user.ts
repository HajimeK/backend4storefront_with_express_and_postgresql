import bcrypt from 'bcrypt';
import { create } from 'domain';
import { connect } from 'http2';
import { Client } from 'pg';
import { dotenv } from  'dotenv';

import client from '../database';

export type UserItem = {
    id: number,
    email: string;
    firstName: string,
    lastName: string,
    password: string
};

dotenv.config();
const {
    BCRYPT_PASSWORD,
    SALT_ROUNDS,
} = process.env;

export class User {

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
    async index(category?: string, top?: boolean, num?: number): Promise<ProductItem[]> {
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


    //- [OPTIONAL] Top 5 most popular products

    async show(id: string): Promise<ProductItem> {
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

    async create(u: UserItem): Promise<UserItem> {
        try {
            // @ts-ignore
            const conn = await client.connect();
            const hash = bcrypt.hashSync(u.password + pepper ,parseInt(SALT_ROUNDS));
            const sql = 'INSERT INTO user (email, first_name, last_name, userpassword ) \
                        VALUES(${UserItem.email}, ${UserItem.firstName}, ${UserItem.lastName}, ${hash}) RETURNING *';

            const result = await conn.query(sql);
            const user = result.rows[0];
            conn.release()

            return user;
        } catch(error) {
            thow new Error('unable to create a suer ($u.username)': $(error));
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



bcrypt.compareSync(password+pepper, user.password_digest);

async authenticate(username: string, password: string): Promise<User | null> {
    const conn = await Client.connet();
    const sql = "SELECT password_diget FROM user WHERE username=($1";

    const result = await connect.query(sql, [username]);

    console.log(password+BCRYPT_PASSWORD);

    if(result.rows.length) {
        const user = result.rows[0];
        console.log(user);
        if(bcrypt.compareSync(password+BCRYPT_PASSWORD, user.password_digest)) {
            return user;
        }

    } else {
        return null;
    }
}