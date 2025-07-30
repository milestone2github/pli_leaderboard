import React, { useEffect, useState } from 'react';
import axios from 'axios';
import bgImage from '../assets/leaderboard-bg.png';
import trophyIcon from '../assets/icons/trophy_48.png';
import './Leaderboard.css';

const baseUrl = process.env.REACT_APP_API_URL;


const getMedal = (index) => {
  const medals = ['🥇', '🥈', '🥉'];
  return medals[index] || index + 1;
};

const Leaderboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    let url = baseUrl ? `${baseUrl}/leaderboard` : '/api/leaderboard';
    axios.get(url)
      .then((res) => setData(res.data))
      .catch((err) => console.error('Failed to fetch leaderboard:', err));
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 py-10"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="relative w-full max-w-6xl p-8 rounded-3xl border-2 border-cyan-400 bg-black/30 backdrop-blur-lg shadow-[0_0_40px_rgba(0,255,255,0.4)]">

        {/* Title */}
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
  <h2 className="text-2xl font-extrabold tracking-wider px-6 py-1 rounded-full border-2 border-cyan-400 text-cyan-100 bg-[#0b1835]">
    LEADERBOARD
  </h2>
</div>
        {/* Table */}
        <table className="w-full text-white text-center rounded-xl overflow-hidden mt-10">
          <thead>
            <tr className="bg-blue-900 text-white text-lg">
              <th className="py-3">#</th>
              <th className="py-3">Employee Name</th>
              <th className="py-3">Employee ID</th>
              <th className="py-3">Leads</th>
              <th className="py-3">Points</th>
            </tr>
          </thead>
          <tbody>
  {data.map((row, index) => (
    <tr
      key={index}
      className={`${
        index % 2 === 0 ? 'bg-blue-900/50' : 'bg-blue-800/50'
      } border-b border-blue-700`}
    >
      <td className="py-4 text-3xl font-bold">{getMedal(index)}</td>
      <td className="py-4">{row.employee_name}</td>
      <td className="py-4">{row._id}</td> 
      <td className="py-4">{row.lead_count}</td>
      <td className={`py-4 font-bold relative`}>
        <span>{row.total_points}</span>
        {index === 0 && <img src={trophyIcon} alt="Trophy icon" className='w-8 inline absolute right-4 text-right'/>}
        </td>
    </tr>
  ))}
</tbody>

        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
