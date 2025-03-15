const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth'); 
const path = require('path');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

 

//88888888

// const app = express();
// app.use(bodyParser.urlencoded({ extended: true }));
// app.set('view engine', 'ejs');

// mongoose.connect('mongodb://localhost:27017/cmsDB', { useNewUrlParser: true, useUnifiedTopology: true });

// const cmsSchema = new mongoose.Schema({
//   name: String,
//   template: String,
//   content: String
// });

// const CMS = mongoose.model('CMS', cmsSchema);

// app.get('/', (req, res) => {
//   CMS.find({}, (err, cmsList) => {
//     if (err) {
//       console.log(err);
//     } else {
//       res.render('index', { cmsList: cmsList });
//     }
//   });
// });

// app.post('/add', (req, res) => {
//   const newCMS = new CMS({
//     name: req.body.name,
//     template: req.body.template,
//     content: req.body.content
//   });
//   newCMS.save((err) => {
//     if (err) {
//       console.log(err);
//     } else {
//       res.redirect('/');
//     }
//   });
// });
// app.get('/cms/:id', (req, res) => {
//     CMS.findById(req.params.id, (err, foundCMS) => {
//       if (err) {
//         console.log(err);
//       } else {
//         res.render(`../templates/${foundCMS.template}`, {
//           name: foundCMS.name,
//           content: foundCMS.content
//         });
//       }
//     });
//   });
  

// app.listen(3000, () => {
//   console.log('Server started on port 3000');
// });
