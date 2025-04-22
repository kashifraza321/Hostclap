const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth'); 
const path = require('path');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const bodyParser = require('body-parser');

const router = express.Router();
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const corsOptions = {
  credentials: true,
  origin: ['http://localhost:4201', 'http://localhost:4200'] // Whitelist the domains you want to allow
};
app.use(cors(corsOptions));
// Middleware to parse JSON
app.use(express.json());
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(bodyParser.json());

// MongoDB connection
// mongoose.connect('mongodb://localhost:27017/formDB', { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('Connected to MongoDB'))
//     .catch((err) => console.log('MongoDB connection error:', err));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});

// Define a simple schema and model
const itemSchema = new mongoose.Schema({
  name: String,
  quantity: Number
});

const Item = mongoose.model('Item', itemSchema);

/**
 * @swagger
 * /items:
 *   get:
 *     summary: Get all items
 *     responses:
 *       200:
 *         description: A list of items.
 */
// Create (POST) - Add a new item
app.post('/items', async (req, res) => {
  try {
    const newItem = new Item(req.body);
    const savedItem = await newItem.save();
    res.status(201).send(savedItem);
  } catch (err) {
    res.status(500).send('Error creating item: ' + err.message);
  }
});

// Read (GET) - Retrieve all items
app.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.send(items);
  } catch (err) {
    res.status(500).send('Error retrieving items: ' + err.message);
  }
});

// Update (PUT) - Update an item by ID
app.put('/items/:id', async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(updatedItem);
  } catch (err) {
    res.status(500).send('Error updating item: ' + err.message);
  }
});

// Delete (DELETE) - Delete an item by ID
app.delete('/items/:id', async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.send('Item deleted');
  } catch (err) {
    res.status(500).send('Error deleting item: ' + err.message);
  }
});


// Routes
app.use('/auth', authRoutes);
/*
/**
 * @swagger
 * /api/items:
 *   get:
 *     summary: Get all items
 *     responses:
 *       200:
 *         description: A list of items.
 * /
app.get('/api/items', async (req, res) => {
  const items = await Item.find();
  res.json(items);
});


app.get('/api/items/:id', async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) {
    return res.status(404).send('Item not found');
  }
  res.json(item);
});
*/
// Swagger Setup
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Node MongoDB API',
      version: '1.0.0',
      description: 'A simple API to demonstrate Swagger in a Node.js app',
    },
  },
  apis: ['./server.js', './routes/**/*.js'], // Add your routes files here
};

const specs = swaggerJsdoc(options);
 
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true, // Enable the API explorer in Swagger UI
}));


/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login to obtain a JWT token
 *     description: Authenticates the user by checking the username and password, then returns a JWT token if credentials are valid.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The username of the user
 *                 default: "user@examdple.com"  # Preset default value
 *               password:
 *                 type: string
 *                 description: The password of the user
 *                 default: "secret123"  # Preset default value  
 *     responses:
 *       200:
 *         description: Successfully logged in, JWT token returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ username:email });
    if (!user) {
      return res.status(400).send('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid credentials');
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).send('Error logging in: ' + err.message);
  }
});


// Register Route
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - firstName
 *               - lastName
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               password:
 *                 type: string
 *                 format: password
 *                 example: secret123
 *     responses:
 *       201:
 *         description: User successfully registered
 *       500:
 *         description: Server error while registering user
 */
router.post('/auth/register', async (req, res) => {
  try {
    const { email,firstName,lastName, password } = req.body;
    const user = new User({ username: email, password });
    await user.save();
    res.status(201).send('User successfully registered');
  } catch (err) {
    res.status(500).send('Error registering user: ' + err.message);
  }
});

 






app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

 
 
