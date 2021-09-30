import dotenv from 'dotenv';
import { Pool } from 'pg';

// Load configs
dotenv.config();
const {
    POSTGRES_HOST,
    POSTGRES_DB,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_DB_TEST,
    ENV,
  } = process.env;

let client: Pool;
console.log(ENV)

if(ENV === 'prod') {
  client = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_DB_TEST,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
  })
} else {
  // otherwise explicitly declared as 'pord' run as ENV === 'test'
  client = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
  })
}

export default client