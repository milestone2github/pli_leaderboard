import LoginPage from "./components/LoginPage";
import Leaderboard from "./components/Leaderboard";
import { Route, Routes } from "react-router-dom";
import { useState } from "react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const updateLoggedIn = (value) => {
    setIsLoggedIn(value);
  }

  return (
    <Routes>
      <Route path='/' element={ <LoginPage isLoggedIn={isLoggedIn} updateLoggedIn={updateLoggedIn}/> } />
      <Route path='/leaderboard' element={ <Leaderboard isLoggedIn={isLoggedIn} updateLoggedIn={updateLoggedIn}/> } />
    </Routes>
  )
}

export default App;
