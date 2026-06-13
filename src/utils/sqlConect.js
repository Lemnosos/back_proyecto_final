import pg from 'pg';
const { Pool } = pg;

/**
 * Pool de conexiones a PostgreSQL.
 * Toma la configuración de las variables de entorno (.env).
 * @type {Pool}
 */
export const pool = new Pool({
    user: process.env.SQL_USER,
    host: process.env.SQL_HOST,
    database: process.env.SQL_DB,
    password: process.env.SQL_PASS,
    port: process.env.SQL_PORT
});
