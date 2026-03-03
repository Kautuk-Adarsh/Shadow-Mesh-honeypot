const { Pool } = require('pg');
require('dotenv').config();

const dbClient = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const connectDB = async() => {
    try {
        const client = await dbClient.connect();
        console.log("cockroach db connected (Pool ready!)");
        client.release();
    } catch(error) {
        console.error("Database connection failed", error);
    }
};

module.exports = { dbClient, connectDB };   