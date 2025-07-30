const Leaderboard = require('../models/Leaderboard');

exports.getLeaderboard = async (req, res) => {
  try {
    const data = await Leaderboard.aggregate([
      {
        $group: {
          _id: "$employee_id",
          employee_name: { $first: "$employee_name" },
          total_points: { $sum: "$points" },
          lead_count: {
            $sum: {
              $cond: [{ $ne: ["$lead_id", null] }, 1, 0]
            }
          }
        }
      },
      { $sort: { total_points: -1 } }
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message});
  }
};


