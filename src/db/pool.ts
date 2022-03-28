import { env } from '@materya/carbon'
import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: env.get('DATABASE_HOST', '127.0.0.1'),
  user: env.get('DATABASE_USER', 'root'),
  password: env.get('DATABASE_PASSWORD', 'password'),
  database: env.get('DATABASE_NAME', 'test'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true,
});

export default pool
