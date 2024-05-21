const  Pool  = require('pg').Pool
const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    port: 5433,
    password: "KMTri123",
    database: "users",
}
)
module.exports = pool;