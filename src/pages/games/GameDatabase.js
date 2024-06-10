import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import AddGamePopup from '../../components/pop-up/menu/addGame/AddGamePopup';
import CardGame from '../../components/GameCard/GameCard';
import SortDropdown from '../../components/SortDropdown/SortDropdown';
import './GameDatabase.css';

const GameDatabase = () => {
  const [games, setGames] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [sortCriteria, setSortCriteria] = useState('date-newest'); 

  useEffect(() => {
    const q = query(collection(db, 'games'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const gamesData = [];
      querySnapshot.forEach((doc) => {
        gamesData.push({ ...doc.data(), id: doc.id });
      });
      setGames(gamesData);
    });

    return () => unsubscribe();
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleAddGame = (newGame) => {
    setGames((prevGames) => {
      const isDuplicate = prevGames.some(game => game.id === newGame.id);
      if (isDuplicate) {
        return prevGames;
      }
      return [...prevGames, newGame];
    });
  };

  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const handleSortChange = (criteria) => {
    setSortCriteria(criteria);
  };

  const sortedGames = [...games].sort((a, b) => {
    switch (sortCriteria) {
      case 'title-asc':
        return a.title.localeCompare(b.title);
      case 'title-desc':
        return b.title.localeCompare(a.title);
      case 'date-newest':
        return new Date(b.releaseDate) - new Date(a.releaseDate);
      case 'date-oldest':
        return new Date(a.releaseDate) - new Date(b.releaseDate);
      default:
        return 0;
    }
  });

  return (
    <div>
      {showPopup && <AddGamePopup onClose={handleClosePopup} onAddGame={handleAddGame} />}
      <div className="game-database">
        <div className="game-database-container">
          <h1>List Game</h1>
          <div className="controls">
            <SortDropdown onSortChange={handleSortChange} />
            <button className="add-game-button" onClick={handleOpenPopup}>Add Game</button>
          </div>
        </div>
        <div className="game-list">
          {sortedGames.map((game) => (
            <CardGame key={game.id} game={game} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameDatabase;
