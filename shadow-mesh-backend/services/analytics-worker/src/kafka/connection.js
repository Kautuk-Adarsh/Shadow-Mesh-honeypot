const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'shadow-analytics-worker',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});

const initKafkaAdmin = async () => {
  console.log(' Checking Kafka Topics...');
  const admin = kafka.admin();
  await admin.connect();
  await admin.createTopics({
    topics: [{ topic: 'sensor-logs' }],
  });
  await admin.disconnect();
  console.log(' Topic verified!');
};

module.exports = { kafka, initKafkaAdmin };