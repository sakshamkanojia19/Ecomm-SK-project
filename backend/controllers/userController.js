
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};


const registerUser = async (req, res, next) => {
  try {
    console.log('Register request received:', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { name, email, password } = req.body;


    const userExists = await User.findOne({ email });

    if (userExists) {
      console.log('User already exists with email:', email);
      return res.status(400).json({ message: 'User already exists with this email' });
    }


    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      console.log('User created successfully:', user._id);
      
      res.status(201).json({
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } else {
      console.error('Invalid user data');
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Error in registerUser:', error);
    next(error);
  }
};


const loginUser = async (req, res, next) => {
  try {
    console.log('Login request received:', { email: req.body.email });
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { email, password } = req.body;


    const user = await User.findOne({ email });

    if (!user) {
      console.log('User not found with email:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }


    const isPasswordMatch = await user.comparePassword(password);
    
    if (isPasswordMatch) {
      console.log('Login successful for user:', user._id);
      
      res.json({
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } else {
      console.log('Invalid password for user:', email);
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error in loginUser:', error);
    next(error);
  }
};


const getUserProfile = async (req, res, next) => {
  try {
    console.log('Get profile request for user:', req.user._id);
    
    const user = await User.findById(req.user._id).select('-password');

    if (user) {
      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      console.log('User not found with id:', req.user._id);
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    next(error);
  }
};


const createDemoUser = async (req, res, next) => {
  try {
    console.log('Creating demo user if needed');


    const demoUser = await User.findOne({ email: 'demo@example.com' });

    if (demoUser) {
      console.log('Demo user already exists');
      return res.status(200).json({ 
        message: 'Demo user already exists',
        credentials: {
          email: 'demo@example.com',
          password: 'password123'
        }
      });
    }


    const user = await User.create({
      name: 'Demo User',
      email: 'demo@example.com',
      password: 'password123',
    });

    console.log('Demo user created successfully');
    res.status(201).json({ 
      message: 'Demo user created successfully',
      credentials: {
        email: 'demo@example.com',
        password: 'password123'
      }
    });
  } catch (error) {
    console.error('Error in createDemoUser:', error);
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  createDemoUser,
};
