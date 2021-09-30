import { PoolClient } from 'pg';
import client from '../database';

describe('Test Suite for database client', () => {

    let conn: PoolClient;
    it('connect to db', async () => {
        conn = await client.connect();
        expect(conn).not.toBeNull();
    });

    it('release db connection', () => {
        conn.release();
    });
});