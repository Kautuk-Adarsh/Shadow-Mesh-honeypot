require('dotenv').config();
const { initDB } = require('./db/database');
const { initKafkaAdmin } = require('./kafka/connection');
const { startConsumer } = require('./kafka/consumer');

const startWorker = async () => {
  try {
    await initDB();
    await initKafkaAdmin();
    await startConsumer();

  } catch (error) {
    console.error('Critical Error in Analytics Worker:', error);
    process.exit(1); 
  }
};

startWorker();