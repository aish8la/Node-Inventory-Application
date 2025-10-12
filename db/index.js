const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DB_URL
});

async function query(queryConfig = {}) {
    const result = await pool.query(queryConfig);
    return result;
}

async function getClient() {
    return await pool.connect();
}

module.exports = {
    query,
    getClient,
};