const express = require('express');
const router = express.Router();
const { getRecentAttacks } = require('../controllers/attackController');


router.get('/', getRecentAttacks);

module.exports = router;