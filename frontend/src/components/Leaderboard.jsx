import { useEffect, useState } from 'react';
import axios from 'axios';
import bgImage from '../assets/leaderboard-bg.png';
import trophyIcon from '../assets/icons/trophy_48.png';
import './Leaderboard.css';
import { useNavigate } from 'react-router-dom';

const baseUrl = process.env.REACT_APP_API_URL;
console.log("base url ==> ", baseUrl);

const getMedal = (index) => {
  const medals = ['🥇', '🥈', '🥉'];
  return medals[index] || index + 1;
};

const Leaderboard = ({isLoggedIn, updateLoggedIn}) => {
  const [data, setData] = useState([]);
  // const [user, setUser] = useState('');
  const [isLoading, setLoading] = useState(true);
  const navigate = useNavigate();

  console.log("Inside Leaderboard component...");

  // Check if login session is valid
  useEffect(() => {
		const checkLoggedIn = async () => {
			try {
        setLoading(true);
				const { data } = await axios.get(
					`${process.env.REACT_APP_API_URL}/auth/checkLoggedIn`,
          { withCredentials: true }
				);
				updateLoggedIn(data.loggedIn);
				// setUser(data.user);

				if (!data.loggedIn) {
					navigate("/", { replace: true });
          return;
				}
			} catch (error) {
				console.error("Error Checking session", error.message);
				navigate("/", { replace: true });
			} finally {
				setLoading(false);
			}
		};
    checkLoggedIn();
    // eslint-disable-next-line
	}, []);

  useEffect(() => {
    if (!isLoggedIn) return;

    let url = baseUrl ? `${baseUrl}/api/leaderboard` : '/api/leaderboard';
    axios
			.get(url, { withCredentials: true })
			.then((res) => setData(res.data))
			// .catch((err) => console.error('Failed to fetch leaderboard:', err));
			.catch((err) => {
				if (err.response?.status === 401) {
					navigate("/", { replace: true });   // Navigate to Login page if session is expired
				} else {
					console.error("Failed to fetch leaderboard:", err);
				}
			});
      // eslint-disable-next-line
  }, [isLoggedIn]);

  // Handle Logout
  const handleLogout = async () => {
    setLoading(true);
    try {
      await axios.post(
        baseUrl ? `${baseUrl}/auth/logout` : "/auth/logout",
        {},
        { withCredentials: true }
      );
      updateLoggedIn(false);
      // setUser(null);
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Unable to logout.");
      throw new Error(err);
    } finally {
      setLoading(false);
    }
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white text-xl">
        Loading...
      </div>
    );
  }

  if(!isLoggedIn) {
    return null;
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 py-10"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="
        relative
        w-full
        max-w-6xl
        p-8
        rounded-3xl
        border-2
        border-cyan-400
        bg-black/30
        backdrop-blur-lg
        shadow-[0_0_40px_rgba(0,255,255,0.4)]
        flex
        flex-col
        justify-center
      ">

    { /* Logout Button */ }
    <div className="ml-auto">
      <button
        className='
          px-4
          py-2
          w-auto
          text-white
          font-bold
          bg-red-500
          hover:bg-red-800
          shadow-md
          rounded-md
        '
        onClick={handleLogout}
      >
        LOGOUT
      </button>
    </div>    

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
