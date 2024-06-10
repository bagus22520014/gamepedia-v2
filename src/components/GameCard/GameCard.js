import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import './GameCard.css';

const GameCard = ({ game }) => {
  const navigate = useNavigate();

  const handleMoreInfoClick = () => {
    navigate(`/games/${game.id}`);
  };

  const formatReleaseDate = (releaseDate) => {
    try {
      return format(new Date(releaseDate), ' MMM dd, yyyy');
    } catch (error) {
      return releaseDate;
    }
  };

  return (
    <div className="game-card">
      <img src={game.imageUrl} alt={game.title} className="game-card-image" />
      <h3>{game.title}</h3>
      <p><strong>RELEASE DATE:</strong> {formatReleaseDate(game.releaseDate)}</p>
      <p><strong>GENRE:</strong> {game.genre.join(', ')}</p>
      <button className="game-card-button" onClick={handleMoreInfoClick}>more information</button>
    </div>
  );
};

export default GameCard;
