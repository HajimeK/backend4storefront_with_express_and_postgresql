import dotenv from 'dotenv';
import path from 'path';
import { Pool } from 'pg';

// Load configs
const ENV_PATH = path.join('..' + path.sep + '..' + path.sep, '.env');
dotenv.config({path: ENV_PATH});
const {
    POSTGRES_HOST,
    POSTGRES_DB,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_DB_TEST,
    ENV,
  } = process.env;

let client: Pool;

if(ENV === 'prod') {
  client = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
  });
} else {
  // otherwise explicitly declared as 'pord' run as ENV === 'test'
  client = new Pool({
    host: "0.0.0.0",
    database: POSTGRES_DB_TEST,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
  });
}

export default client;