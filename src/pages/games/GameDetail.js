import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { format } from 'date-fns';
import './GameDetail.css';
import backIcon from '../../asset/icon/back-icon.png';

const GameDetail = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGame = async () => {
      const docRef = doc(db, 'games', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setGame(docSnap.data());
      } else {
        console.log('No such document!');
      }
    };

    fetchGame();
  }, [id]);

  if (!game) {
    return <div className="loading">Loading...</div>;
  }

  const getYouTubeEmbedUrl = (url) => {
    let videoId = '';
    if (url.includes('youtube.com')) {
      const urlObj = new URL(url);
      videoId = urlObj.searchParams.get('v');
    } else if (url.includes('youtu.be')) {
      const urlObj = new URL(url);
      videoId = urlObj.pathname.substring(1);
    }
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const formatReleaseDate = (releaseDate) => {
    try {
      return format(new Date(releaseDate), ' MMM dd, yyyy');
    } catch (error) {
      return releaseDate;
    }
  };

  return (
    <div className="game-detail">
      <div className="game-detail-header">
        <img src={backIcon} alt="Back" className="back-icon" onClick={() => navigate(-1)} />
        <h1 className="game-detail-title">{game.title}</h1>
        <button className="edit-button">Edit</button>
      </div>
      <div className="game-detail-content">
        <div className="game-detail-left">
          <iframe 
            className="game-detail-trailer" 
            src={getYouTubeEmbedUrl(game.trailer)} 
            title="YouTube video player" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen>
          </iframe>
          <div className="game-detail-screenshots">
            {Array.isArray(game.screenshots) && game.screenshots.map((screenshot, index) => (
              <img key={index} src={screenshot} alt={`Screenshot ${index + 1}`} className="screenshot"/>
            ))}
          </div>
        </div>
        <div className="game-detail-right">
          <div className="game-info">
            <h2>INFO:</h2>
          </div>
          <div className="game-detail-section">
            <p><strong>DEVELOPER:</strong> {game.developers}</p>
            <p><strong>PUBLISHER:</strong> {game.publishers}</p>
            <p><strong>GENRE:</strong> {game.genre.join(', ')}</p>
            <p><strong>RELEASE DATE:</strong> {formatReleaseDate(game.releaseDate)}</p>
          </div>
          <div className="game-info">
            <h2>SYNOPSIS:</h2>
          </div>
          <div className="game-detail-section">
            <p>{game.synopsis}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetail;
