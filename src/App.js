import React, { createContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Home from './pages/home/Home';
import GameDatabase from './pages/games/GameDatabase';
import SignUp from './pages/signup/SignUp';
import Login from './pages/login/Login';
import AlertManager from './components/pop-up/menu/alert/notif/AlertManager';
import GameDetail from './pages/games/GameDetail';  
import NewGames from './pages/home/games/NewGames'; 
import PlayStationGames from './pages/home/games/PlayStationGames'; 
import XboxGames from './pages/home/games/XboxGames'; 
import NintendoGames from './pages/home/games/NintendoGames';

export const PreviousRouteContext = createContext('');

const TrackPreviousRoute = ({ children }) => {
  const location = useLocation();
  const [previousRoute, setPreviousRoute] = useState('');

  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath !== '/signup' && currentPath !== '/login') {
      setPreviousRoute(currentPath);
    }
  }, [location]);

  return (
    <PreviousRouteContext.Provider value={previousRoute}>
      {children}
    </PreviousRouteContext.Provider>
  );
};

function App() {
  return (
    <AlertManager>
      <Router>
        <TrackPreviousRoute>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="/games" element={<GameDatabase />} />
              <Route path="/games/:id" element={<GameDetail />} /> 
              <Route path="/new-games" element={<NewGames />} />
              <Route path="/playstation-games" element={<PlayStationGames />} />
              <Route path="/xbox-games" element={<XboxGames />} />
              <Route path="/nintendo-games" element={<NintendoGames />} />
            </Route>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </TrackPreviousRoute>
      </Router>
    </AlertManager>
  );
}

export default App;
