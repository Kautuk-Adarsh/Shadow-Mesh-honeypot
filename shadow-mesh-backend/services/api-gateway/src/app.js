require('dotenv').config();
const express = require('express');
const { connectRedis } = require('./models/cache');
const cors = require('cors');

const { connectDB } = require('./models/db');
const attackRoutes = require('./routes/attackRoutes');

const app = express();
const PORT = process.env.PORT ;

app.use(cors()); 
app.use(express.json());

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Shadow Mesh API Gateway serving on port ${PORT}`);
});

app.use('/api/attacks', attackRoutes);
app.get('/health', (req, res) => {
  res.json({ status: 'Shadow Mesh API Gateway is live and routing traffic' });
});

app.listen(PORT, async () => {
  await connectDB();
  await connectRedis();
  console.log(`Shadow Mesh API Gateway serving `);
});