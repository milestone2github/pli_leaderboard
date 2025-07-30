const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
  employee_name: { type: String, required: true },
  employee_id: { type: String, required: true },
  lead_id: { type: String, required: true },
  justification: String,
  reason: String,
  weight_factor: Number,
  points: { type: Number, required: true },
  updated_at: { type: Date, default: Date.now }
}, { collection: 'Leaderboard' });  

module.exports = mongoose.model('Leaderboard', leaderboardSchema);
