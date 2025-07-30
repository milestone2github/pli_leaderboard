const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path')
require('dotenv').config();
const Leaderboard = require('./models/Leaderboard');


const leaderboardRoutes = require('./routes/leaderboardRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

const frontendRoute = path.join(__dirname, '../frontend', 'build');

app.use(cors());
app.use(express.json());
// use static files 
app.use(express.static(frontendRoute));

app.use('/api', leaderboardRoutes);

// serve static files from frontend/build
// '/{*splat}' -> replacement of '*' in express v5
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(frontendRoute, 'index.html'));
})

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}).catch(err => console.error('MongoDB connection failed:', err));


