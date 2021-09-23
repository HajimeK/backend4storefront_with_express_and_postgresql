import bcrypt from 'bcrypt';
import { create } from 'domain';
import { connect } from 'http2';
import { Client } from 'pg';

dotenv.config();
const {
    BCRYPT_PASSWORD,
    SALT_ROUNDS,
} = process.env;

acync create(u: User): Promise<User> {
    try {
        const conn = await Client.connect();
        const sql = 'INSERT INTO user (first_name, last_name, username, )';
        const hash = bcrypt.hashSync(u.password + pepper ,parseInt(SALT_ROUNDS));

        const result = await conn.query(sql, [u.username, hash]);
        const user = result.rows[0];

        conn.release()

        return user

    } catch(error) {
        thow new Error('unable to create a suer ($u.username)': $(error));
    }

}


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