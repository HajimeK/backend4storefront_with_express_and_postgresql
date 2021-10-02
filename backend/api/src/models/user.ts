import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

import client from '../database';

export interface User {
    id: number;
    email: string;
    firstname: string,
    lastname: string;
    userpassword: string;
}

dotenv.config();
const {
    BCRYPT_PASSWORD,
    SALT_ROUNDS,
} = process.env;

export class ModelUser {

    async index(): Promise<User[]> {
        try {
            // Generate SQL query
            const sql = 'SELECT id, email, firstname, lastname FROM appuser';
            // request to DB
            const conn = await client.connect();
            const result = await conn.query(sql);
            conn.release();


            return result.rows as User[];
        } catch (error) {
            throw new Error(`Could not get users. Error: ${(error as Error).message}`);
        }
    }

    async show(id: number): Promise<User> {
        try {
            const sql = `SELECT appuser.id, appuser.email, appuser.firstname, appuser.lastname \
                            FROM appuser \
                            WHERE id=${id}`;
            // request to DB
            const conn = await client.connect();
            const result = await conn.query(sql);
            conn.release();

            return result.rows[0] as User;
        } catch (error) {
            throw new Error(`Could not find a user ${id}. Error: ${(error as Error).message}`);
        }
    }

    async create(u: User): Promise<User> {
        try {
            const conn = await client.connect();
            const hash = bcrypt.hashSync(u.userpassword + (BCRYPT_PASSWORD as string),
                                        Number(SALT_ROUNDS));
            const sql = `INSERT INTO appuser (email, firstname, lastname, userpassword ) \
                        VALUES('${u.email}', '${u.firstname}', '${u.lastname}', '${hash}') RETURNING *`;
            // request to DB
            const result = await conn.query(sql);
            const user = result.rows[0] as User;
            conn.release()

            return user;
        } catch(error) {
            throw new Error(`unable to create a uer ${u.lastname}, ${u.firstname}: ${(error as Error).message}`);
        }
    }

    async update(u: User): Promise<User> {
        try {
            const conn = await client.connect();
            const hash = bcrypt.hashSync(u.userpassword + (process.env.BCRYPT_PASSWORD as string),
                                        Number(process.env.SALT_ROUND));
            const sql = `UPDATE appuser \
                            SET email = '${u.email}', \
                                firstname   = '${u.firstname}', \
                                lastname = '${u.lastname}', \
                                userpassword = '${hash}' \
                            WHERE  appuser.id = ${u.id} \
                            RETURNING *`;
            // request to DB
            const result = await conn.query(sql);
            const user = result.rows[0] as User;
            conn.release()

            return user;
        } catch(error) {
            throw new Error(`unable to create a uer ${u.lastname}, ${u.firstname}: ${(error as Error).message}`);
        }
    }

    async delete(id: number): Promise<User> {
        try {
            const sql = `DELETE FROM appuser WHERE id=${id} RETURNING *`;
            // request to DB
            const conn = await client.connect();
            const result = await conn.query(sql);
            const user = result.rows[0] as User;
            conn.release();

            return user;
        } catch (error) {
            throw new Error(`Could not delete user ${id}. Error: ${(error as Error).message}`)
        }
    }

    async authenticate(email: string, password: string): Promise<User | null> {

        const sql = `SELECT * FROM appuser WHERE email='${email}'`;

        const conn = await client.connect();
        const result = await conn.query(sql);
        conn.release();

        if(result.rows.length) {
            const user = result.rows[0] as User;
            if(bcrypt.compareSync(password+ (process.env.BCRYPT_PASSWORD as string), user.userpassword)) {
                return user;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
}