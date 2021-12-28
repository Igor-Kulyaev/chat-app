const express = require('express');
const router = express.Router();
const authContr = require('../controllers/auth');
const { registerValidator } = require('../validator.js')

router.post('/auth', registerValidator(), authContr.authContr);

module.exports = router;
