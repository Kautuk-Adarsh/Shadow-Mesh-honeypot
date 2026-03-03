const { createClient } = require('redis');

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log(' API Gateway securely connected to Redis Cache!');
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
  }
};

module.exports = { redisClient, connectRedis };