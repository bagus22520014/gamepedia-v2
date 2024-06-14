import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db } from '../../firebaseConfig';
import { format } from 'date-fns';
import './GameDetail.css';
import backIcon from '../../asset/icon/back-icon.png';
import closeIcon from '../../asset/icon/close-icon-white.png'; 
import { AlertContext } from '../alert/AlertManager';
import AlertConfirmation from '../alert/AlertConfirmation';
import AlertNotification from '../alert/AlertNotification';

const platforms = [
  { name: "Steam", logo: require('../../asset/logo/Steam-Logo.png') },
  { name: "Epic Games", logo: require('../../asset/logo/Epic_Games-Logo.png') },
  { name: "PlayStation 4", logo: require('../../asset/logo/PlayStation-Logo.png') },
  { name: "PlayStation 5", logo: require('../../asset/logo/PlayStation-Logo.png') },
  { name: "Xbox One", logo: require('../../asset/logo/Xbox-Logo.png') },
  { name: "Xbox Series S/X", logo: require('../../asset/logo/Xbox-Logo.png') },
  { name: "Nintendo Switch", logo: require('../../asset/logo/Nintendo_Switch-Logo.png') },
  { name: "Android", logo: require('../../asset/logo/Android-Logo.png') },
  { name: "iOS", logo: require('../../asset/logo/Apple-Logo.png') }
];

const genres = [
  "Action", "Adventure", "Casual", "Fighting", "FPS", "MMORPG", "Open-world", 
  "Puzzle", "Racing", "RPG", "Roguelike", "Simulation", "Sports", "Stealth",
  "Strategy", "Survival horror", "TPS", "Visual novel"
];

const GameDetail = () => {
  const { id } = useParams();
  const { addAlert } = useContext(AlertContext);
  const [game, setGame] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedGame, setEditedGame] = useState({});
  const [currentMedia, setCurrentMedia] = useState(null);
  const [newScreenshots, setNewScreenshots] = useState([]);
  const [dropdowns, setDropdowns] = useState({ genre: false, platform: false });
  const [screenshots, setScreenshots] = useState([]);
  const [showDeleteConfirmation, etShowDeleteConfirmation] = useState(false);
  const navigate = useNavigate();
  const storage = getStorage();

  const genreRef = useRef(null);
  const platformRef = useRef(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const docRef = doc(db, 'games', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const gameData = docSnap.data();
          setGame(gameData);
          setEditedGame({
            ...gameData,
            screenshots: gameData.screenshots || [],
            releaseDateType: determineReleaseDateType(gameData.releaseDate),
            season: extractSeason(gameData.releaseDate),
            year: extractYear(gameData.releaseDate)
          });
          setScreenshots(gameData.screenshots || []);
          setCurrentMedia(getYouTubeEmbedUrl(gameData.trailer));
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error("Error fetching game data: ", error);
      }
    };

    fetchGame();
  }, [id]);

  const determineReleaseDateType = (releaseDate) => {
    if (!releaseDate) return 'none';
    if (/\d{4}-\d{2}-\d{2}/.test(releaseDate)) return 'date';
    if (/\d{4}-\d{2}/.test(releaseDate)) return 'season';
    if (/\d{4}/.test(releaseDate)) return 'year';
    return 'none';
  };

  const extractSeason = (releaseDate) => {
    if (!releaseDate) return '';
    const month = new Date(releaseDate).getMonth() + 1;
    if (month >= 3 && month <= 5) return 'Spring';
    if (month >= 6 && month <= 8) return 'Summer';
    if (month >= 9 && month <= 11) return 'Fall';
    if (month === 12 || month <= 2) return 'Winter';
    return '';
  };

  const extractYear = (releaseDate) => {
    if (!releaseDate) return '';
    return new Date(releaseDate).getFullYear();
  };

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

  const getYouTubeThumbnail = (url) => {
    try {
      let videoId = '';
      if (url.includes('youtube.com')) {
        const urlObj = new URL(url);
        videoId = urlObj.searchParams.get('v');
      } else if (url.includes('youtu.be')) {
        const urlObj = new URL(url);
        videoId = urlObj.pathname.substring(1);
      }
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    } catch (error) {
      console.error("Error getting YouTube thumbnail: ", error);
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
      const updateGame = async () => {
        try {
          const docRef = doc(db, 'games', id);
          await updateDoc(docRef, editedGame);
          setGame(editedGame);
          addAlert('success', 'Game updated successfully.');
        } catch (error) {
          console.error("Error updating game data: ", error);
          addAlert('error', 'Failed to update game.');
        }
      };
      updateGame();
    }
  };

  const handleDelete = async () => {
    setShowDeleteConfirmation(false);
    try {
      const docRef = doc(db, 'games', id);
      await deleteDoc(docRef);
      navigate('/games');
      addAlert('success', 'Game deleted successfully.');
    } catch (error) {
      console.error("Error deleting game data: ", error);
      addAlert('error', 'Failed to delete game.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedGame({ ...editedGame, [name]: value });
  };

  const handleCheckboxChange = (e, category) => {
    const { name, checked } = e.target;
    setEditedGame((prev) => ({
      ...prev,
      [category]: checked
        ? [...prev[category], name]
        : prev[category].filter((item) => item !== name)
    }));
  };

  const toggleDropdown = (category) => {
    setDropdowns((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const handleScreenshotChange = async (e) => {
    const files = Array.from(e.target.files);
    const uploadPromises = files.map(async (file) => {
      const storageRef = ref(storage, `screenshots/${editedGame.title.replace(/\s+/g, '-')}/${file.name}`);
      await uploadBytes(storageRef, file);
      return getDownloadURL(storageRef);
    });

    const urls = await Promise.all(uploadPromises);
    setNewScreenshots([...urls, ...newScreenshots]);
    setEditedGame({ ...editedGame, screenshots: [...urls, ...(editedGame.screenshots || [])] });
    setScreenshots((prevScreenshots) => [...urls, ...prevScreenshots]);
  };

  const handleScreenshotDelete = async (url) => {
    const fileRef = ref(storage, url);
    try {
      await deleteObject(fileRef);
      setScreenshots((prevScreenshots) => prevScreenshots.filter((s) => s !== url));
      setEditedGame((prev) => ({ ...prev, screenshots: prev.screenshots.filter((s) => s !== url) }));
    } catch (error) {
      console.error("Error deleting screenshot: ", error);
    }
  };

  const handleTrailerChange = (e) => {
    const url = e.target.value;
    setEditedGame({ ...editedGame, trailer: url });
    setCurrentMedia(getYouTubeEmbedUrl(url));
  };

  return (
    <div className="game-detail-container">
      {game && (
        <>
          <div className="game-detail-header">
            <button className="back-button" onClick={() => navigate(-1)}>
              <img src={backIcon} alt="Back" />
            </button>
            {isEditing ? (
              <button className="save-button" onClick={handleEditToggle}>Save</button>
            ) : (
              <button className="edit-button" onClick={handleEditToggle}>Edit</button>
            )}
            <button className="delete-button" onClick={() => setShowDeleteConfirmation(true)}>Delete</button>
          </div>
          <div className="game-detail-content">
            <div className="game-detail-left">
              <div className="game-detail-title">
                {isEditing ? (
                  <input type="text" name="title" value={editedGame.title} onChange={handleChange} />
                ) : (
                  <h1>{game.title}</h1>
                )}
              </div>
              <div className="game-detail-release-date">
                <label>Release Date: </label>
                {isEditing ? (
                  <>
                    <select
                      name="releaseDateType"
                      value={editedGame.releaseDateType}
                      onChange={handleChange}
                    >
                      <option value="none">None</option>
                      <option value="date">Date</option>
                      <option value="season">Season</option>
                      <option value="year">Year</option>
                    </select>
                    {editedGame.releaseDateType === 'date' && (
                      <input
                        type="date"
                        name="releaseDate"
                        value={editedGame.releaseDate}
                        onChange={handleChange}
                      />
                    )}
                    {editedGame.releaseDateType === 'season' && (
                      <>
                        <select
                          name="season"
                          value={editedGame.season}
                          onChange={handleChange}
                        >
                          <option value="">Select season</option>
                          <option value="Spring">Spring</option>
                          <option value="Summer">Summer</option>
                          <option value="Fall">Fall</option>
                          <option value="Winter">Winter</option>
                        </select>
                        <input
                          type="number"
                          name="year"
                          value={editedGame.year}
                          onChange={handleChange}
                          placeholder="Year"
                        />
                      </>
                    )}
                    {editedGame.releaseDateType === 'year' && (
                      <input
                        type="number"
                        name="year"
                        value={editedGame.year}
                        onChange={handleChange}
                        placeholder="Year"
                      />
                    )}
                  </>
                ) : (
                  <span>{formatReleaseDate(game.releaseDate)}</span>
                )}
              </div>
              <div className="game-detail-platforms">
                <label>Platforms: </label>
                {isEditing ? (
                  <>
                    <button onClick={() => toggleDropdown('platform')}>
                      Select Platforms
                    </button>
                    {dropdowns.platform && (
                      <div className="dropdown" ref={platformRef}>
                        {platforms.map((platform) => (
                          <label key={platform.name}>
                            <input
                              type="checkbox"
                              name={platform.name}
                              checked={editedGame.platforms.includes(platform.name)}
                              onChange={(e) => handleCheckboxChange(e, 'platforms')}
                            />
                            <img src={platform.logo} alt={platform.name} />
                            {platform.name}
                          </label>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <ul>
                    {game.platforms.map((platform) => (
                      <li key={platform}>
                        <img
                          src={platforms.find((p) => p.name === platform)?.logo}
                          alt={platform}
                        />
                        {platform}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="game-detail-genres">
                <label>Genres: </label>
                {isEditing ? (
                  <>
                    <button onClick={() => toggleDropdown('genre')}>
                      Select Genres
                    </button>
                    {dropdowns.genre && (
                      <div className="dropdown" ref={genreRef}>
                        {genres.map((genre) => (
                          <label key={genre}>
                            <input
                              type="checkbox"
                              name={genre}
                              checked={editedGame.genres.includes(genre)}
                              onChange={(e) => handleCheckboxChange(e, 'genres')}
                            />
                            {genre}
                          </label>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <ul>
                    {game.genres.map((genre) => (
                      <li key={genre}>{genre}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="game-detail-description">
                <label>Description: </label>
                {isEditing ? (
                  <textarea
                    name="description"
                    value={editedGame.description}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{game.description}</p>
                )}
              </div>
            </div>
            <div className="game-detail-right">
              <div className="game-detail-cover">
                <label>Cover: </label>
                {isEditing ? (
                  <>
                    <input
                      type="file"
                      name="cover"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        const storageRef = ref(storage, `covers/${editedGame.title.replace(/\s+/g, '-')}/${file.name}`);
                        uploadBytes(storageRef, file).then(() => {
                          getDownloadURL(storageRef).then((url) => {
                            setEditedGame({ ...editedGame, cover: url });
                          });
                        });
                      }}
                    />
                    {editedGame.cover && (
                      <img src={editedGame.cover} alt="Cover" />
                    )}
                  </>
                ) : (
                  <img src={game.cover} alt="Cover" />
                )}
              </div>
              <div className="game-detail-trailer">
                <label>Trailer: </label>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      name="trailer"
                      value={editedGame.trailer}
                      onChange={handleTrailerChange}
                    />
                    {editedGame.trailer && (
                      <img src={getYouTubeThumbnail(editedGame.trailer)} alt="Trailer" />
                    )}
                  </>
                ) : (
                  <iframe
                    src={currentMedia}
                    frameBorder="0"
                    allowFullScreen
                    title="Trailer"
                  ></iframe>
                )}
              </div>
              <div className="game-detail-screenshots">
                <label>Screenshots: </label>
                {isEditing ? (
                  <>
                    <input
                      type="file"
                      multiple
                      onChange={handleScreenshotChange}
                    />
                    <div className="screenshots-preview">
                      {screenshots.map((screenshot) => (
                        <div key={screenshot} className="screenshot-item">
                          <img src={screenshot} alt="Screenshot" />
                          <button
                            onClick={() => handleScreenshotDelete(screenshot)}
                          >
                            <img src={closeIcon} alt="Delete" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="screenshots-preview">
                    {game.screenshots.map((screenshot) => (
                      <img key={screenshot} src={screenshot} alt="Screenshot" />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
      <AlertConfirmation
        show={showDeleteConfirmation}
        onHide={() => setShowDeleteConfirmation(false)}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this game? This action cannot be undone."
      />
      <AlertNotification />
    </div>
  );
};

export default GameDetail;
