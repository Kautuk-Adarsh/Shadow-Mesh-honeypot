const { kafka } = require('./connection');
const { saveAttackLog } = require('../db/database');
const { analyzeThreat } = require('../ai/threat-analyzer'); 

const consumer = kafka.consumer({ groupId: 'threat-analysis-group' });
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const startConsumer = async () => {
  console.log('Connecting Consumer to Kafka...');
  await consumer.connect();
  console.log('Connected! Subscribing to topic...');
  await consumer.subscribe({ topic: 'sensor-logs', fromBeginning: true });
  console.log('Listening for attacks and analyzing threats...');
  
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const rawString = message.value.toString();
        const logData = JSON.parse(rawString);

        console.log(`\n INTEL INCOMING: ${logData.username} from ${logData.ip}`);
        console.log(` AI is analyzing the payload...`);
        
        await delay(2000);
        const aiIntel = await analyzeThreat(logData.username, logData.password);
        
        console.log(`   ➤ Threat Score: ${aiIntel.threatScore}/10`);
        console.log(`   ➤ Attack Type: ${aiIntel.attackType}`);
        console.log(`   ➤ AI Note: ${aiIntel.analysis}`);

        await saveAttackLog(logData, aiIntel);
        console.log(` Locked into vault.`);
        
      } catch (error) {
        console.error(` Failed to process message:`, error);
      }
    }
  });
};

module.exports = { startConsumer };