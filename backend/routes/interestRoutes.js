
const express = require('express');
const { getUserInterests, updateUserInterests } = require('../controllers/interestController');
const { protect } = require('../middleware/auth');

const router = express.Router();


router.get('/', protect, getUserInterests);


router.put('/', protect, updateUserInterests);

module.exports = router;
