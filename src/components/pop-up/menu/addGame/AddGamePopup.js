import React, { useState, useContext, useRef, useEffect } from 'react';
import './AddGamePopup.css';
import closeIcon from '../../../../asset/icon/close-icon-white.png';
import { db, storage } from '../../../../firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { AlertContext } from '../alert/notif/AlertManager';

const genres = [
  "Action", "Adventure", "Casual", "Fighting", "FPS", "MMORPG", "Open-world", 
  "Puzzle", "Racing", "RPG", "Roguelike", "Simulation", "Sports", "Stealth",
  "Strategy", "Survival horror", "TPS", "Visual novel"
];

const platforms = [
  "PC", "PlayStation 4", "PlayStation 5","Xbox One" , "Xbox Series S/X", 
  "Nintendo Switch", "Android", "iOS"
];

const AddGamePopup = ({ onClose, onAddGame }) => {
  const [gameData, setGameData] = useState({
    title: '',
    synopsis: '',
    genre: [],
    releaseDateType: 'date',
    releaseDate: '',
    season: '',
    year: '',
    developers: '',
    publishers: '',
    trailer: '',
    platform: [],
    rating: '',
    image: null,
  });

  const [fileName, setFileName] = useState("Choose Image");
  const [dropdowns, setDropdowns] = useState({ genre: false, platform: false });

  const { addAlert } = useContext(AlertContext);
  const genreRef = useRef(null);
  const platformRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (genreRef.current && !genreRef.current.contains(event.target)) {
        setDropdowns((prevDropdowns) => ({ ...prevDropdowns, genre: false }));
      }
      if (platformRef.current && !platformRef.current.contains(event.target)) {
        setDropdowns((prevDropdowns) => ({ ...prevDropdowns, platform: false }));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGameData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setGameData((prevData) => ({
      ...prevData,
      image: file,
    }));
    setFileName(file ? file.name : "Choose Image");
  };

  const handleCheckboxChange = (e, type) => {
    const { name, checked } = e.target;
    setGameData((prevData) => {
      const list = [...prevData[type]];
      if (checked) {
        if (!list.includes(name)) {
          list.push(name);
        }
      } else {
        const index = list.indexOf(name);
        if (index > -1) {
          list.splice(index, 1);
        }
      }
      return { ...prevData, [type]: list };
    });
  };

  const toggleDropdown = (type) => {
    setDropdowns((prevDropdowns) => ({
      ...prevDropdowns,
      [type]: !prevDropdowns[type],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = '';
      if (gameData.image) {
        const imageRef = ref(storage, `game-images/${gameData.image.name}`);
        await uploadBytes(imageRef, gameData.image);
        imageUrl = await getDownloadURL(imageRef);
      }

      let releaseDate = '';
      switch (gameData.releaseDateType) {
        case 'date':
          releaseDate = gameData.releaseDate;
          break;
        case 'season':
          releaseDate = `${gameData.season} ${gameData.year}`;
          break;
        case 'year':
          releaseDate = gameData.year;
          break;
        case 'none':
          releaseDate = '-';
          break;
        default:
          releaseDate = '';
      }

      const newGame = {
        title: gameData.title,
        synopsis: gameData.synopsis,
        genre: gameData.genre,
        releaseDate,
        developers: gameData.developers,
        publishers: gameData.publishers,
        trailer: gameData.trailer,
        platform: gameData.platform,
        rating: gameData.rating,
        imageUrl,
      };

      const docRef = await addDoc(collection(db, 'games'), newGame);
      newGame.id = docRef.id;

      console.log('Game added successfully');
      addAlert('success', 'Game successfully added');
      onAddGame(newGame);
      onClose();
    } catch (error) {
      console.error('Error adding game: ', error);
      addAlert('error', 'Failed to add game');
    }
  };

  return (
    <div className="add-game-popup">
      <div className="add-game-popup-content">
        <button className="close-button" onClick={onClose}>
          <img src={closeIcon} alt="Close Icon" className="close-icon-img" />
        </button>
        <h2>Add New Game</h2>
        <form onSubmit={handleSubmit} className="add-game-form">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={gameData.title}
            onChange={handleChange}
            required
          />
          <div className="dropdown-container" ref={genreRef}>
            <div className="dropdown-label" onClick={() => toggleDropdown('genre')}>
              {gameData.genre.length > 0 ? gameData.genre.join(', ') : 'Genre'}
            </div>
            {dropdowns.genre && (
              <div className="dropdown-content">
                {genres.map((genre) => (
                  <label key={genre}>
                    <input
                      type="checkbox"
                      name={genre}
                      checked={gameData.genre.includes(genre)}
                      onChange={(e) => handleCheckboxChange(e, 'genre')}
                    />
                    {genre}
                  </label>
                ))}
              </div>
            )}
          </div>
          <div className="dropdown-container" ref={platformRef}>
            <div className="dropdown-label" onClick={() => toggleDropdown('platform')}>
              {gameData.platform.length > 0 ? gameData.platform.join(', ') : 'Platform'}
            </div>
            {dropdowns.platform && (
              <div className="dropdown-content">
                {platforms.map((platform) => (
                  <label key={platform}>
                    <input
                      type="checkbox"
                      name={platform}
                      checked={gameData.platform.includes(platform)}
                      onChange={(e) => handleCheckboxChange(e, 'platform')}
                    />
                    {platform}
                  </label>
                ))}
              </div>
            )}
          </div>
          <textarea
            name="synopsis"
            placeholder="Synopsis"
            value={gameData.synopsis}
            onChange={handleChange}
            required
          ></textarea>
          <select
            name="releaseDateType"
            value={gameData.releaseDateType}
            onChange={handleChange}
            required
          >
            <option value="date">Date</option>
            <option value="season">Season and Year</option>
            <option value="year">Year</option>
            <option value="none">-</option>
          </select>
          {gameData.releaseDateType === 'date' && (
            <input
              type="date"
              name="releaseDate"
              value={gameData.releaseDate}
              onChange={handleChange}
              required
            />
          )}
          {gameData.releaseDateType === 'season' && (
            <>
              <select
                name="season"
                value={gameData.season}
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
                value={gameData.year}
                onChange={handleChange}
                required
              />
            </>
          )}
          {gameData.releaseDateType === 'year' && (
            <input
              type="number"
              name="year"
              placeholder="Year"
              value={gameData.year}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="text"
            name="developers"
            placeholder="Developers"
            value={gameData.developers}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="publishers"
            placeholder="Publishers"
            value={gameData.publishers}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="trailer"
            placeholder="Trailer (YouTube Link)"
            value={gameData.trailer}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="rating"
            placeholder="Rating"
            value={gameData.rating}
            onChange={handleChange}
            required
          />
          <div className="custom-file-upload">
            <input
              type="file"
              id="file"
              className="file-input"
              onChange={handleFileChange}
              required
            />
            <label htmlFor="file" className="file-label">{fileName}</label>
          </div>
          <button type="submit">Add Game</button>
        </form>
      </div>
    </div>
  );
};

export default AddGamePopup;
