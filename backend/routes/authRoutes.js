const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { login, getMe, logout, getCsrfToken } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { authValidators } = require('../middleware/validators');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts, please try again later' },
});

router.post('/login', authLimiter, authValidators.login, validate, login);
router.get('/csrf-token', getCsrfToken);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

module.exports = router;
