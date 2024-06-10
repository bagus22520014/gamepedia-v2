import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { format } from 'date-fns';
import './GameDetail.css';
import backIcon from '../../asset/icon/back-icon.png';

const GameDetail = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedGame, setEditedGame] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const docRef = doc(db, 'games', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setGame(docSnap.data());
          setEditedGame(docSnap.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error("Error fetching game data: ", error);
      }
    };

    fetchGame();
  }, [id]);

  const getYouTubeEmbedUrl = (url) => {
    try {
      let videoId = '';
      if (url.includes('youtube.com')) {
        const urlObj = new URL(url);
        videoId = urlObj.searchParams.get('v');
      } else if (url.includes('youtu.be')) {
        const urlObj = new URL(url);
        videoId = urlObj.pathname.substring(1);
      }
      return `https://www.youtube.com/embed/${videoId}`;
    } catch (error) {
      console.error("Error parsing YouTube URL: ", error);
      return '';
    }
  };

  const formatReleaseDate = (releaseDate) => {
    try {
      return format(new Date(releaseDate), 'MMM dd, yyyy');
    } catch (error) {
      console.error("Error formatting release date: ", error);
      return releaseDate;
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // Save changes
      const updateGame = async () => {
        try {
          const docRef = doc(db, 'games', id);
          await updateDoc(docRef, editedGame);
          setGame(editedGame);
        } catch (error) {
          console.error("Error updating game data: ", error);
        }
      };
      updateGame();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedGame({ ...editedGame, [name]: value });
  };

  if (!game) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="game-detail">
      <div className="game-detail-header">
        <img src={backIcon} alt="Back" className="back-icon" onClick={() => navigate(-1)} />
        {isEditing ? (
          <input
            type="text"
            name="title"
            value={editedGame.title}
            onChange={handleChange}
            className="game-detail-title-input"
          />
        ) : (
          <h1 className="game-detail-title">{game.title}</h1>
        )}
        <button className="edit-button" onClick={handleEditToggle}>
          {isEditing ? 'Save' : 'Edit'}
        </button>
      </div>
      <div className="game-detail-content">
        <div className="game-detail-left">
          <iframe
            className="game-detail-trailer"
            src={getYouTubeEmbedUrl(game.trailer)}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <div className="game-detail-screenshots">
            {Array.isArray(game.screenshots) &&
              game.screenshots.map((screenshot, index) => (
                <img key={index} src={screenshot} alt={`Screenshot ${index + 1}`} className="screenshot" />
              ))}
          </div>
        </div>
        <div className="game-detail-right">
          <div className="game-info">
            <h2>INFO:</h2>
          </div>
          <div className="game-detail-section">
            {isEditing ? (
              <>
                <p>
                  <strong>DEVELOPER:</strong>
                  <input
                    type="text"
                    name="developers"
                    value={editedGame.developers}
                    onChange={handleChange}
                    className="game-detail-input"
                  />
                </p>
                <p>
                  <strong>PUBLISHER:</strong>
                  <input
                    type="text"
                    name="publishers"
                    value={editedGame.publishers}
                    onChange={handleChange}
                    className="game-detail-input"
                  />
                </p>
                <p>
                  <strong>GENRE:</strong>
                  <input
                    type="text"
                    name="genre"
                    value={editedGame.genre.join(', ')}
                    onChange={handleChange}
                    className="game-detail-input"
                  />
                </p>
                <p>
                  <strong>RELEASE DATE:</strong>
                  <input
                    type="text"
                    name="releaseDate"
                    value={editedGame.releaseDate}
                    onChange={handleChange}
                    className="game-detail-input"
                  />
                </p>
              </>
            ) : (
              <>
                <p><strong>DEVELOPER:</strong> {game.developers}</p>
                <p><strong>PUBLISHER:</strong> {game.publishers}</p>
                <p><strong>GENRE:</strong> {game.genre.join(', ')}</p>
                <p><strong>RELEASE DATE:</strong> {formatReleaseDate(game.releaseDate)}</p>
              </>
            )}
          </div>
          <div className="game-info">
            <h2>SYNOPSIS:</h2>
          </div>
          <div className="game-detail-section">
            {isEditing ? (
              <textarea
                name="synopsis"
                value={editedGame.synopsis}
                onChange={handleChange}
                className="game-detail-textarea"
              />
            ) : (
              <p>{game.synopsis}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetail;
