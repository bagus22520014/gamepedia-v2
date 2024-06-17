import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import CardGame from '../../../components/GameCard/GameCard';
import './games.css';

const PlayStationGames = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      const q = query(
        collection(db, 'games'),
        where('platform', 'array-contains-any', ['PlayStation 4', 'PlayStation 5'])
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const gamesData = [];
        querySnapshot.forEach((doc) => {
          gamesData.push({ ...doc.data(), id: doc.id });
        });

        gamesData.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
        setGames(gamesData);
      });

      return () => unsubscribe();
    };

    fetchGames();
  }, []);

  return (
    <div className="playstation-games">
      <div className="playstation-games-container">
        <h1>PlayStation Games</h1>
      </div>
      <div className="game-list">
        {games.map((game) => (
          <CardGame key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
};

export default PlayStationGames;
