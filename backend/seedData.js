
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { faker } = require('@faker-js/faker');
const Category = require('./models/Category');
const User = require('./models/User');
const Interest = require('./models/Interest');


dotenv.config();


mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected for seeding...'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });


const generateUniqueCategories = (count) => {
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


  while (categories.length < count) {
 
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

  return categories;
};


const seedCategories = async () => {
  try {
  
    await Category.deleteMany();
    console.log('Categories cleared');


    const categories = generateUniqueCategories(100);


    const insertedCategories = await Category.insertMany(categories);
    console.log(`${insertedCategories.length} categories seeded successfully!`);
    
    return insertedCategories;
  } catch (error) {
    console.error('Error seeding categories:', error);
    throw error;
  }
};


const seedUsers = async () => {
  try {

    await User.deleteMany();
    console.log('Users cleared');


    const user = await User.create({
      name: 'Demo User',
      email: 'demo@example.com',
      password: 'password123',
    });

    console.log('Demo user created successfully!');
    return user;
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
};


const seedUserInterests = async (user, categories) => {
  try {

    await Interest.deleteMany();
    console.log('Interests cleared');

 
    const numInterests = Math.floor(Math.random() * 10) + 5;
    const shuffled = [...categories].sort(() => 0.5 - Math.random());
    const selectedCategories = shuffled.slice(0, numInterests);
    

    await Interest.create({
      user: user._id,
      categories: selectedCategories.map(cat => cat._id)
    });

    console.log(`${numInterests} interests assigned to demo user`);
  } catch (error) {
    console.error('Error seeding user interests:', error);
    throw error;
  }
};


const seedDatabase = async () => {
  try {
    const categories = await seedCategories();
    const user = await seedUsers();
    await seedUserInterests(user, categories);
    
    console.log('All seed operations completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
