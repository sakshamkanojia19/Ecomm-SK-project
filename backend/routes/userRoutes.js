
const express = require('express');
const { check } = require('express-validator');
const { registerUser, loginUser, getUserProfile, createDemoUser } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();


router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  ],
  registerUser
);


router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  loginUser
);


router.get('/profile', protect, getUserProfile);


router.post('/create-demo', createDemoUser);

module.exports = router;
