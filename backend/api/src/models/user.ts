import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

import client from '../database';

export type User = {
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

export class ModelUser {

    async index(): Promise<User[]> {
        try {
            // Generate SQL query
            const sql = 'SELECT user.id, user.email. user.firstname, user.lastname \
                        FROM user';
            // request to DB
            const conn = await client.connect();
            const result = await conn.query(sql);
            conn.release();

            return result.rows;
        } catch (error) {
            throw new Error(`Could not get users. Error: ${error}`);
        }
    }

    async show(id: number): Promise<User> {
        try {
            const sql = 'SELECT user.id, user.email. user.firstname, user.lastname \
                            FROM user \
                            WHERE id=($1)';
            // request to DB
            const conn = await client.connect();
            const result = await conn.query(sql, [id]);
            conn.release();

            return result.rows[0];
        } catch (error) {
            throw new Error(`Could not find a user ${id}. Error: ${error}`);
        }
    }

    async create(u: User): Promise<User> {
        try {
            const conn = await client.connect();
            const hash = bcrypt.hashSync(u.password + process.env.BCRYPT_PASSWORD , Number(process.env.SALT_ROUND));
            const sql = 'INSERT INTO user (email, first_name, last_name, userpassword ) \
                        VALUES($1, $2, $3, $4) RETURNING *';
            // request to DB
            const result = await conn.query(sql,
                                            [
                                                u.email,
                                                u.firstName,
                                                u.lastName,
                                                hash
                                            ]);
            const user = result.rows[0];
            conn.release()

            return user;
        } catch(error) {
            throw new Error(`unable to create a uer ${u.lastName}, ${u.firstName}: ${error}`);
        }
    }

    async update(u: User): Promise<User> {
        try {
            const conn = await client.connect();
            const hash = bcrypt.hashSync(u.password + process.env.BCRYPT_PASSWORD , Number(process.env.SALT_ROUND));
            const sql = 'UPDATE user \
                            SET email = $1, \
                                first_name   = $2 \
                                last_name = $3 \
                                userpassword = $4; \
                            WHERE  user.id = $5 \
                            RETURNING *;';
            // request to DB
            const result = await conn.query(sql,
                                            [
                                                u.email,
                                                u.firstName,
                                                u.lastName,
                                                hash,
                                                u.id
                                            ]);
            const user = result.rows[0];
            conn.release()

            return user;
        } catch(error) {
            throw new Error(`unable to create a uer ${u.lastName}, ${u.firstName}: ${error}`);
        }
    }

    async delete(id: number): Promise<User> {
        try {
            const sql = 'DELETE FROM product WHERE id=($1)';
            // request to DB
            const conn = await client.connect();
            const result = await conn.query(sql, [id]);
            const user = result.rows[0];
            conn.release();

            return user;
        } catch (error) {
            throw new Error(`Could not delete book ${id}. Error: ${error}`)
        }
    }

    async authenticate(email: string, password: string): Promise<User | null> {

        const sql = "SELECT password FROM user WHERE email=($1)";

        const conn = await client.connect();
        const result = await conn.query(sql, [email]);
        conn.release();

        if(result.rows.length) {
            const user = result.rows[0];
            console.log(user);
            if(bcrypt.compareSync(password+BCRYPT_PASSWORD, user.password)) {
                return user;
            } else {
                return null;
            }

        } else {
            return null;
        }
    }
};