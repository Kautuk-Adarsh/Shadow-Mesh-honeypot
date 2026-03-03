const { dbClient } = require('../models/db');
const { redisClient } = require('../models/cache');

const getRecentAttacks = async (req, res) => {
  try {
    const cachedAttacks = await redisClient.get('recentAttacks');
    
    if (cachedAttacks) {
      console.log('Serving threat intel from Redis Cache');
      return res.json(JSON.parse(cachedAttacks));
    }
    console.log(' Cache miss. Fetching from CockroachDB...');
    const query = `
      SELECT id, ip, username, password, timestamp, threat_score, attack_type, ai_analysis 
      FROM attack_logs 
      ORDER BY created_at DESC 
      LIMIT 50;
    `;
    const result = await dbClient.query(query);
    
    const responseData = {
      success: true,
      count: result.rowCount,
      data: result.rows
    };
    await redisClient.setEx('recentAttacks', 60, JSON.stringify(responseData));

    res.json(responseData);

  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ success: false, message: 'Server Error fetching threat intel' });
  }
};

module.exports = { getRecentAttacks };