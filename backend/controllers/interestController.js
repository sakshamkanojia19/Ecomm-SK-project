
const Interest = require('../models/Interest');
const Category = require('../models/Category');


const getUserInterests = async (req, res, next) => {
  try {
    console.log(`Getting interests for user: ${req.user._id}`);
    
    const interests = await Interest.findOne({ user: req.user._id })
      .populate('categories', 'name description');

    if (interests && interests.categories && interests.categories.length > 0) {
      console.log(`Found ${interests.categories.length} interests for user`);
      
      
      const formattedCategories = interests.categories.map(cat => ({
        id: cat._id.toString(),
        name: cat.name,
        description: cat.description
      }));
      
      const categoryIds = interests.categories.map(cat => cat._id.toString());
      
      res.json({
        categories: formattedCategories,
        categoryIds
      });
    } else {
      console.log('No interests found for user');

      res.json({ 
        categories: [],
        categoryIds: [] 
      });
    }
  } catch (error) {
    console.error('Error in getUserInterests:', error);
    next(error);
  }
};


const updateUserInterests = async (req, res, next) => {
  try {
    const { categoryIds } = req.body;
    console.log(`Updating interests for user ${req.user._id} with categories:`, categoryIds);

    if (!Array.isArray(categoryIds)) {
      return res.status(400).json({ message: 'categoryIds must be an array' });
    }

   
    let interests = await Interest.findOne({ user: req.user._id });

    if (interests) {
      console.log('Updating existing interests');

      interests.categories = categoryIds;
      await interests.save();
    } else {
      console.log('Creating new interests document');
   
      interests = await Interest.create({
        user: req.user._id,
        categories: categoryIds,
      });
    }

    console.log('Interests updated successfully');
    

    res.json({
      message: 'Interests updated successfully',
      categoryIds,
    });
  } catch (error) {
    console.error('Error in updateUserInterests:', error);
    next(error);
  }
};

module.exports = {
  getUserInterests,
  updateUserInterests,
};
