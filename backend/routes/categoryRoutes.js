
const express = require('express');
const { check } = require('express-validator');
const { getCategories, getCategoryById, createCategory, seedCategories } = require('../controllers/categoryController');
const { protect } = require('../middleware/auth');

const router = express.Router();


router.get('/', getCategories);


router.get('/:id', getCategoryById);


router.post(
  '/',
  protect,
  [
    check('name', 'Name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
  ],
  createCategory
);


router.post('/seed', protect, seedCategories);

module.exports = router;
