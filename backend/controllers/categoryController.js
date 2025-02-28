
const { validationResult } = require('express-validator');
const Category = require('../models/Category');
const { faker } = require('@faker-js/faker');


const getCategories = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 6;
    const skip = (page - 1) * limit;

    console.log(`Getting categories - page: ${page}, limit: ${limit}, skip: ${skip}`);
    
    const total = await Category.countDocuments();
    console.log(`Total categories in database: ${total}`);
    
    const categories = await Category.find()
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit);
    
    console.log(`Retrieved ${categories.length} categories`);
    

    const formattedCategories = categories.map(category => ({
      id: category._id,
      name: category.name,
      description: category.description
    }));

    res.json({
      categories: formattedCategories,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error in getCategories:', error);
    next(error);
  }
};


const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (category) {
      res.json({
        id: category._id,
        name: category.name,
        description: category.description
      });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    next(error);
  }
};


const createCategory = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description } = req.body;

    const categoryExists = await Category.findOne({ name });

    if (categoryExists) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = await Category.create({
      name,
      description,
    });

    res.status(201).json({
      id: category._id,
      name: category.name,
      description: category.description
    });
  } catch (error) {
    next(error);
  }
};


const seedCategories = async (req, res, next) => {
  try {

    await Category.deleteMany({});
    console.log('Categories cleared for seeding');

    
    const interestAreas = [
      'Technology', 'Science', 'Art', 'Music', 'Literature', 'Sports', 
      'Cooking', 'Travel', 'Photography', 'Gaming', 'Fashion', 'Movies',
      'History', 'Nature', 'Business', 'Health', 'Education', 'Politics',
      'Languages', 'DIY', 'Pets', 'Sustainability', 'Space', 'Culture'
    ];

    const categories = [];
    const usedNames = new Set();


    interestAreas.forEach(area => {
      categories.push({
        name: area,
        description: faker.lorem.paragraph().substring(0, 200)
      });
      usedNames.add(area);
    });

    
    while (categories.length < 100) {
      
      let name;
      const nameType = Math.floor(Math.random() * 5);
      
      switch (nameType) {
        case 0:
          name = faker.commerce.department();
          break;
        case 1:
          name = faker.commerce.productAdjective() + ' ' + faker.commerce.product();
          break;
        case 2:
          name = faker.science.chemicalElement().name;
          break;
        case 3:
          name = faker.music.genre();
          break;
        case 4:
          name = faker.word.adjective() + ' ' + faker.word.noun();
          break;
      }

 
      if (!usedNames.has(name)) {
        categories.push({
          name,
          description: faker.lorem.paragraph().substring(0, 200)
        });
        usedNames.add(name);
      }
    }

    
    const insertedCategories = await Category.insertMany(categories);
    console.log(`${insertedCategories.length} categories seeded successfully!`);

    res.status(201).json({ 
      message: `${insertedCategories.length} categories seeded successfully`,
      count: insertedCategories.length
    });
  } catch (error) {
    console.error('Error in seedCategories:', error);
    next(error);
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  seedCategories,
};
