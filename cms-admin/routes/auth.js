const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();
const dotenv = require('dotenv');
 const FormSubmission = require('../models/formSubmission'); // Ensure correct path
  
dotenv.config();

// Register Route
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    res.status(201).send('User registered');
  } catch (err) {
    res.status(500).send('Error registering user: ' + err.message);
  }
});
 
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
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

/**
 * @swagger
 * /submit-form:
 *   post:
 *     summary: Submit form data
 *     description: Submit the form data with website name, domain, email, message, and status.
 *     operationId: submitForm
 *     tags:
 *       - FormSubmission
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               website_name:
 *                 type: string
 *                 description: Name of the website
 *               domain:
 *                 type: string
 *                 description: The domain of the website
 *               email:
 *                 type: string
 *                 description: Email address associated with the form
 *               message:
 *                 type: string
 *                 description: Message from the user
 *               status:
 *                 type: string
 *                 description: Status of the form submission (e.g., 'pending', 'approved')
 *             required:
 *               - website_name
 *               - domain
 *               - email
 *               - message
 *               - status
 *             example:
 *               website_name: Example Site
 *               domain: example.com
 *               email: user@example.com
 *               message: This is a test message
 *               status: pending
 *     responses:
 *       201:
 *         description: Form submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Form submitted successfully!
 *                 data:
 *                   type: object
 *                   properties:
 *                     website_name:
 *                       type: string
 *                       example: Example Site
 *                     domain:
 *                       type: string
 *                       example: example.com
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *                     message:
 *                       type: string
 *                       example: This is a test message
 *                     status:
 *                       type: string
 *                       example: pending
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error submitting form
 *                 error:
 *                   type: string
 *                   example: Some error message
 */

// POST endpoint to submit the form data
router.post('/submit-form', async (req, res) => {
  try {
      const { website_name,domain, email, message,status } = req.body;

      // Create a new form submission document
      const newSubmission = new FormSubmission({
        website_name,
        domain,
          email,
          message,
          status
      });

      // Save the document to MongoDB
      await newSubmission.save();

      res.status(201).json({
          message: 'Form submitted successfully!',
          data: newSubmission
      });
  } catch (err) {
      res.status(500).json({
          message: 'Error submitting form',
          error: err.message
      });
  }
});

module.exports = router;
