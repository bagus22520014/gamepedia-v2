import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db } from '../../firebaseConfig';
import AlertConfirmation from '../../components/pop-up/menu/alert/confirm/AlertConfirmation';
import { AlertContext } from '../../components/pop-up/menu/alert/notif/AlertManager';
import { format } from 'date-fns';
import './GameDetail.css';
import backIcon from '../../asset/icon/back-icon.png';
import closeIcon from '../../asset/icon/close-icon-white.png';

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
  const [showConfirmation, setShowConfirmation] = useState(false);
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

  const handleConfirmDelete = () => {
    setShowConfirmation(true);
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
      setScreenshots((prev) => prev.filter((screenshot) => screenshot !== url));
      setEditedGame((prev) => ({
        ...prev,
        screenshots: prev.screenshots.filter((screenshot) => screenshot !== url)
      }));
    } catch (error) {
      console.error("Error deleting screenshot: ", error);
    }
  };

  const renderPlatformLogos = () => {
    const platformGroups = {};

    platforms.forEach((platform) => {
      if (editedGame.platform && editedGame.platform.includes(platform.name)) {
        if (!platformGroups[platform.logo]) {
          platformGroups[platform.logo] = [];
        }
        platformGroups[platform.logo].push(platform.name);
      }
    });

    return Object.entries(platformGroups).map(([logo, names]) => (
      <p key={logo}>
        <img src={logo} alt={names.join(', ')} className="platform-logo" />
        {names.join(', ')}
      </p>
    ));
  };

  if (!game) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="game-detail">
      {game && (
        <>
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
            <button className="delete-button" onClick={handleConfirmDelete}>Delete</button>

          </div>
          <div className="game-detail-content">
            <div className="game-detail-left">
              {currentMedia.includes('youtube') ? (
                <iframe
                  className="game-detail-trailer"
                  src={currentMedia}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <img src={currentMedia} alt="Gameplay Screenshot" className="game-detail-trailer" />
              )}
              <div className="game-detail-screenshots">
                <img
                  src={getYouTubeThumbnail(game.trailer)}
                  alt="Video Thumbnail"
                  className="screenshot"
                  onClick={() => setCurrentMedia(getYouTubeEmbedUrl(game.trailer))}
                />
                {isEditing && (
                  <div>
                    <label className="file-upload-label">
                      Choose Files
                      <input type="file" multiple onChange={handleScreenshotChange} className="file-upload-input" />
                    </label>
                  </div>
                )}
                {screenshots.map((screenshot, index) => (
                  <div key={index} className="screenshot-container">
                    <img
                      src={screenshot}
                      alt={`Screenshot ${index + 1}`}
                      className="screenshot"
                      onClick={() => setCurrentMedia(screenshot)}
                    />
                    {isEditing && (
                      <img
                        src={closeIcon}
                        alt="Delete"
                        className="delete-icon"
                        onClick={() => handleScreenshotDelete(screenshot)}
                      />
                    )}
                  </div>
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
                      <div className="dropdown-container" ref={genreRef}>
                        <div className="dropdown-label" onClick={() => toggleDropdown('genre')}>
                          {editedGame.genre.length > 0 ? editedGame.genre.join(', ') : 'Select Genres'}
                        </div>
                        {dropdowns.genre && (
                          <div className="dropdown-content">
                            {genres.map((genre) => (
                              <label key={genre}>
                                <input
                                  type="checkbox"
                                  name={genre}
                                  checked={editedGame.genre.includes(genre)}
                                  onChange={(e) => handleCheckboxChange(e, 'genre')}
                                />
                                {genre}
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    </p>
                    <p className="release-date-section">
                      <strong>RELEASE DATE:</strong>
                      <div className="select-container">
                        <select
                          name="releaseDateType"
                          value={editedGame.releaseDateType}
                          onChange={handleChange}
                          required
                        >
                          <option value="date">Date</option>
                          <option value="season">Season and Year</option>
                          <option value="year">Year</option>
                          <option value="none">-</option>
                        </select>
                        {editedGame.releaseDateType === 'date' && (
                          <input
                            type="date"
                            name="releaseDate"
                            value={editedGame.releaseDate}
                            onChange={handleChange}
                            required
                          />
                        )}
                        {editedGame.releaseDateType === 'season' && (
                          <>
                            <select
                              name="season"
                              value={editedGame.season}
                              onChange={handleChange}
                              required
                            >
                              <option value="">Select Season</option>
                              <option value="Spring">Spring</option>
                              <option value="Summer">Summer</option>
                              <option value="Fall">Fall</option>
                              <option value="Winter">Winter</option>
                            </select>
                            <input
                              type="number"
                              name="year"
                              placeholder="Year"
                              value={editedGame.year}
                              onChange={handleChange}
                              required
                            />
                          </>
                        )}
                        {editedGame.releaseDateType === 'year' && (
                          <input
                            type="number"
                            name="year"
                            placeholder="Year"
                            value={editedGame.year}
                            onChange={handleChange}
                            required
                          />
                        )}
                      </div>
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
                <h2>PLATFORM:</h2>
              </div>
              <div className="game-detail-section">
                {isEditing ? (
                  <div className="dropdown-container" ref={platformRef}>
                    <div className="dropdown-label" onClick={() => toggleDropdown('platform')}>
                      {editedGame.platform.length > 0 ? editedGame.platform.join(', ') : 'Platform'}
                    </div>
                    {dropdowns.platform && (
                      <div className="dropdown-content">
                        {platforms.map((platform) => (
                          <label key={platform.name}>
                            <input
                              type="checkbox"
                              name={platform.name}
                              checked={editedGame.platform.includes(platform.name)}
                              onChange={(e) => handleCheckboxChange(e, 'platform')}
                            />
                            {platform.name}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  renderPlatformLogos()
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
        </>
      )}
      {showConfirmation && (
        <AlertConfirmation
          title="Confirm Deletion"
          message="Are you sure you want to delete this game? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setShowConfirmation(false)}
        />
      )}
    </div>
  );
};

export default GameDetail;
