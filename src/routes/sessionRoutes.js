const express = require('express');
const router = express.Router();
const { getSession, startSession } = require('../controllers/sessionController');

router.get('/:id', getSession);
router.post('/start', startSession);

module.exports = router;
