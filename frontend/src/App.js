import LoginPage from "./components/LoginPage";
import Leaderboard from "./components/Leaderboard";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path='/' element={ <LoginPage /> } />
      <Route path='/leaderboard' element={ <Leaderboard /> } />
    </Routes>
  )
}

export default App;
