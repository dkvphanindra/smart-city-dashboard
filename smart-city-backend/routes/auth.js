const express = require('express');
const router = express.Router();
const { register, login, getUserStats } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/stats', getUserStats);

module.exports = router;
