const { Client } = require('pg');
require('dotenv').config();

const dbClient = new Client({
  connectionString: process.env.DATABASE_URL,
});

const initDB = async () => {
  console.log('Connecting to CockroachDB...');
  await dbClient.connect();

  await dbClient.query(`
    CREATE TABLE IF NOT EXISTS attack_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      ip STRING,
      username STRING,
      password STRING,
      timestamp TIMESTAMPTZ,
      threat_score INT,
      attack_type STRING,
      ai_analysis STRING,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  console.log('Database ready!');
};

const saveAttackLog = async (logData, aiIntel) => {
  const insertQuery = `
    INSERT INTO attack_logs (ip, username, password, timestamp, threat_score, attack_type, ai_analysis) 
    VALUES ($1, $2, $3, $4, $5, $6, $7)
  `;
  const values = [
    logData.ip, 
    logData.username, 
    logData.password, 
    logData.timestamp,
    aiIntel.threatScore,
    aiIntel.attackType,
    aiIntel.analysis
  ];
  await dbClient.query(insertQuery, values);
};

module.exports = { initDB, saveAttackLog };