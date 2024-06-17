import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../../firebaseConfig';
import './Home.css';
import arrowLeft from '../../asset/icon/arrow-left.png';
import arrowRight from '../../asset/icon/arrow-right.png';
import CardGame from '../../components/GameCard/GameCard';

function Home() {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [games, setGames] = useState([]);
  const [isScrollAtStart, setIsScrollAtStart] = useState(true);
  const [isScrollAtEnd, setIsScrollAtEnd] = useState(false);
  const [isPlayStationScrollAtStart, setIsPlayStationScrollAtStart] = useState(true);
  const [isPlayStationScrollAtEnd, setIsPlayStationScrollAtEnd] = useState(false);
  const [isXboxScrollAtStart, setIsXboxScrollAtStart] = useState(true);
  const [isXboxScrollAtEnd, setIsXboxScrollAtEnd] = useState(false);
  const [isNintendoScrollAtStart, setIsNintendoScrollAtStart] = useState(true);
  const [isNintendoScrollAtEnd, setIsNintendoScrollAtEnd] = useState(false);

  const auth = getAuth();
  const gameListRef = useRef(null);
  const playstationGameListRef = useRef(null);
  const xboxGameListRef = useRef(null);
  const nintendoGameListRef = useRef(null);

  useEffect(() => {
    const fetchImages = async (user) => {
      try {
        const q = query(collection(db, 'games'), orderBy('releaseDate', 'desc'), limit(5));
        const querySnapshot = await getDocs(q);
        const imageData = [];
        querySnapshot.forEach((doc) => {
          imageData.push({ id: doc.id, ...doc.data() });
        });
        setImages(imageData);
      } catch (err) {
        console.error('Error fetching images:', err);
      }
    };

    const fetchGames = async () => {
      try {
        const q = query(collection(db, 'games'), orderBy('releaseDate', 'desc'));
        const querySnapshot = await getDocs(q);
        const gamesData = [];
        querySnapshot.forEach((doc) => {
          gamesData.push({ id: doc.id, ...doc.data() });
        });
        setGames(gamesData);
      } catch (err) {
        console.error('Error fetching games:', err);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchImages(user);
        fetchGames();
      } else {
        console.error('User not authenticated');
      }
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    }, 15000);

    return () => clearInterval(interval);
  }, [images]);

  useEffect(() => {
    const handleScroll = () => {
      if (gameListRef.current) {
        const { scrollLeft, clientWidth, scrollWidth } = gameListRef.current;
        const isAtStart = scrollLeft === 0;
        const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 10;
        setIsScrollAtStart(isAtStart);
        setIsScrollAtEnd(isAtEnd);
      }
    };

    if (gameListRef.current) {
      gameListRef.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (gameListRef.current) {
        gameListRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    const handlePlayStationScroll = () => {
      if (playstationGameListRef.current) {
        const { scrollLeft, clientWidth, scrollWidth } = playstationGameListRef.current;
        const isAtStart = scrollLeft === 0;
        const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 10;
        setIsPlayStationScrollAtStart(isAtStart);
        setIsPlayStationScrollAtEnd(isAtEnd);
      }
    };

    if (playstationGameListRef.current) {
      playstationGameListRef.current.addEventListener('scroll', handlePlayStationScroll);
    }

    return () => {
      if (playstationGameListRef.current) {
        playstationGameListRef.current.removeEventListener('scroll', handlePlayStationScroll);
      }
    };
  }, []);

  useEffect(() => {
    const handleXboxScroll = () => {
      if (xboxGameListRef.current) {
        const { scrollLeft, clientWidth, scrollWidth } = xboxGameListRef.current;
        const isAtStart = scrollLeft === 0;
        const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 10;
        setIsXboxScrollAtStart(isAtStart);
        setIsXboxScrollAtEnd(isAtEnd);
      }
    };

    if (xboxGameListRef.current) {
      xboxGameListRef.current.addEventListener('scroll', handleXboxScroll);
    }

    return () => {
      if (xboxGameListRef.current) {
        xboxGameListRef.current.removeEventListener('scroll', handleXboxScroll);
      }
    };
  }, []);

  useEffect(() => {
    const handleNintendoScroll = () => {
      if (nintendoGameListRef.current) {
        const { scrollLeft, clientWidth, scrollWidth } = nintendoGameListRef.current;
        const isAtStart = scrollLeft === 0;
        const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 10;
        setIsNintendoScrollAtStart(isAtStart);
        setIsNintendoScrollAtEnd(isAtEnd);
      }
    };

    if (nintendoGameListRef.current) {
      nintendoGameListRef.current.addEventListener('scroll', handleNintendoScroll);
    }

    return () => {
      if (nintendoGameListRef.current) {
        nintendoGameListRef.current.removeEventListener('scroll', handleNintendoScroll);
      }
    };
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const handleGameListScroll = (ref, direction) => {
    if (ref.current) {
      const { scrollLeft, clientWidth } = ref.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      ref.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="home">
      <div className="image-gallery">
        <button className="nav-arrow left-arrow" onClick={handlePrev}>
          <img src={arrowLeft} alt="Previous" />
        </button>
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`image-item ${index === currentIndex ? 'active' : ''}`}
          >
            <img src={image.imageUrl} alt={image.title} />
            <div className="image-info">
              <h2>{image.title}</h2>
              <p>{image.developers} | {image.publishers}</p>
              <div className="genre-container">
                {image.genre.map((genre, idx) => (
                  <div key={idx} className="genre-box">{genre}</div>
                ))}
              </div>
            </div>
          </div>
        ))}
        <button className="nav-arrow right-arrow" onClick={handleNext}>
          <img src={arrowRight} alt="Next" />
        </button>
      </div>

      <div className="home-game-container">
        <div className="home-game-header">
          <h1>New Games</h1>
          <Link to="/new-games">
            <button className="see-more-button">See More</button>
          </Link>
        </div>
        <div className="home-game-list-wrapper">
          {!isScrollAtStart && (
            <button className="nav-arrow left-arrow" onClick={() => handleGameListScroll(gameListRef, 'left')}>
              <img src={arrowLeft} alt="Previous" />
            </button>
          )}
          <div className="home-game-list" ref={gameListRef}>
            {games.map((game) => (
              <CardGame key={game.id} game={game} className="game-card" />
            ))}
          </div>
          {!isScrollAtEnd && (
            <button className="nav-arrow right-arrow" onClick={() => handleGameListScroll(gameListRef, 'right')}>
              <img src={arrowRight} alt="Next" />
            </button>
          )}
        </div>
      </div>

      <div className="home-game-container">
        <div className="home-game-header">
          <h1>PlayStation Games</h1>
          <Link to="/playstation-games">
            <button className="see-more-button">See More</button>
          </Link>
        </div>
        <div className="home-game-list-wrapper">
          {!isPlayStationScrollAtStart && (
            <button className="nav-arrow left-arrow" onClick={() => handleGameListScroll(playstationGameListRef, 'left')}>
              <img src={arrowLeft} alt="Previous" />
            </button>
          )}
          <div className="home-game-list" ref={playstationGameListRef}>
            {games
              .filter((game) => game.platform.includes('PlayStation 4') || game.platform.includes('PlayStation 5'))
              .map((game) => (
                <CardGame key={game.id} game={game} className="game-card" />
              ))}
          </div>
          {!isPlayStationScrollAtEnd && (
            <button className="nav-arrow right-arrow" onClick={() => handleGameListScroll(playstationGameListRef, 'right')}>
              <img src={arrowRight} alt="Next" />
            </button>
          )}
        </div>
      </div>

      <div className="home-game-container">
        <div className="home-game-header">
          <h1>Xbox Games</h1>
          <Link to="/xbox-games">
            <button className="see-more-button">See More</button>
          </Link>
        </div>
        <div className="home-game-list-wrapper">
          {!isXboxScrollAtStart && (
            <button className="nav-arrow left-arrow" onClick={() => handleGameListScroll(xboxGameListRef, 'left')}>
              <img src={arrowLeft} alt="Previous" />
            </button>
          )}
          <div className="home-game-list" ref={xboxGameListRef}>
            {games
              .filter((game) => game.platform.includes('Xbox One') || game.platform.includes('Xbox Series S/X'))
              .map((game) => (
                <CardGame key={game.id} game={game} className="game-card" />
              ))}
          </div>
          {!isXboxScrollAtEnd && (
            <button className="nav-arrow right-arrow" onClick={() => handleGameListScroll(xboxGameListRef, 'right')}>
              <img src={arrowRight} alt="Next" />
            </button>
          )}
        </div>
      </div>

      <div className="home-game-container">
        <div className="home-game-header">
          <h1>Nintendo Games</h1>
          <Link to="/nintendo-games">
            <button className="see-more-button">See More</button>
          </Link>
        </div>
        <div className="home-game-list-wrapper">
          {!isNintendoScrollAtStart && (
            <button className="nav-arrow left-arrow" onClick={() => handleGameListScroll(nintendoGameListRef, 'left')}>
              <img src={arrowLeft} alt="Previous" />
            </button>
          )}
          <div className="home-game-list" ref={nintendoGameListRef}>
            {games
              .filter((game) => game.platform.includes('Nintendo Switch'))
              .map((game) => (
                <CardGame key={game.id} game={game} className="game-card" />
              ))}
          </div>
          {!isNintendoScrollAtEnd && (
            <button className="nav-arrow right-arrow" onClick={() => handleGameListScroll(nintendoGameListRef, 'right')}>
              <img src={arrowRight} alt="Next" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
