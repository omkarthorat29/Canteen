// server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();

// Load environment variables
dotenv.config();

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

// Import routes
const userRoutes = require('./routes/userRoutes');
const canteenRoutes = require('./routes/canteenRoutes');
// app.use('/api', (req,res) => {
//     res.send('Welcome !')
// })
app.use('/api/users', userRoutes);
app.use('/api/canteen', canteenRoutes);

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));
