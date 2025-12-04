const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/database');
const leadRoutes = require('./routes/leads');
const startCronJob = require('./jobs/cronJob');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/leads', leadRoutes);

// Start cron job
startCronJob();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
