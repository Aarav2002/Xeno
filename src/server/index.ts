import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cors from 'cors';
import { User } from '../models/User.js';
import { Customer } from '../models/Customer.js';
import { Segment } from '../models/Segment.js';

dotenv.config(); // Load .env variables

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/crm')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Error handler
const errorHandler = (err: any, res: express.Response) => {
  console.error('Server error:', err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  res.status(statusCode).json({ message });
};

// Register new user
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      console.log('Missing required fields:', { name, email, password: !!password });
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ name, email, password });
    await user.save();
    console.log('User created successfully:', user._id);

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    const response = {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
      },
    };
    console.log('Sending response:', response);
    res.status(201).json(response);
  } catch (error) {
    console.error('Registration error:', error);
    errorHandler(error, res);
  }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
      },
    });
  } catch (error) {
    errorHandler(error, res);
  }
});

// Customer API endpoints
// Get all customers
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    errorHandler(err, res);
  }
});

// Create new customer
app.post('/api/customers', async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json(customer);
  } catch (err) {
    errorHandler(err, res);
  }
});

// Update customer
app.put('/api/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (err) {
    errorHandler(err, res);
  }
});

// Delete customer
app.delete('/api/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json({ message: 'Customer deleted successfully' });
  } catch (err) {
    errorHandler(err, res);
  }
});

// Get all segments
app.get('/api/segments', async (req, res) => {
  try {
    const segments = await Segment.find().sort({ createdAt: -1 });
    res.json(segments);
  } catch (error) {
    errorHandler(error, res);
  }
});

// Get single segment
app.get('/api/segments/:id', async (req, res) => {
  try {
    const segment = await Segment.findById(req.params.id);
    if (!segment) {
      return res.status(404).json({ message: 'Segment not found' });
    }
    res.json(segment);
  } catch (error) {
    errorHandler(error, res);
  }
});

// Create new segment
app.post('/api/segments', async (req, res) => {
  try {
    const { name, description, rules, customerCount } = req.body;
    
    if (!name || !description || !rules) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const segment = new Segment({
      name,
      description,
      rules,
      customerCount: customerCount || 0
    });

    await segment.save();
    res.status(201).json(segment);
  } catch (error) {
    errorHandler(error, res);
  }
});

// Update segment
app.put('/api/segments/:id', async (req, res) => {
  try {
    const { name, description, rules, customerCount } = req.body;
    
    if (!name || !description || !rules) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const segment = await Segment.findByIdAndUpdate(
      req.params.id,
      { 
        name, 
        description, 
        rules, 
        customerCount: customerCount || 0,
        lastUpdated: new Date() 
      },
      { new: true }
    );

    if (!segment) {
      return res.status(404).json({ message: 'Segment not found' });
    }

    res.json(segment);
  } catch (error) {
    errorHandler(error, res);
  }
});

// Delete segment
app.delete('/api/segments/:id', async (req, res) => {
  try {
    const segment = await Segment.findByIdAndDelete(req.params.id);
    
    if (!segment) {
      return res.status(404).json({ message: 'Segment not found' });
    }

    res.json({ message: 'Segment deleted successfully' });
  } catch (error) {
    errorHandler(error, res);
  }
});

// AI Rules Generation endpoint

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`)); 