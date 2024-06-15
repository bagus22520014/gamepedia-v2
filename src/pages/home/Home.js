import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../../firebaseConfig';
import './Home.css';
import arrowLeft from '../../asset/icon/arrow-left.png';
import arrowRight from '../../asset/icon/arrow-right.png';

function Home() {
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const auth = getAuth();

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
        setError(err.message);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchImages(user);
      } else {
        setError('User not authenticated');
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

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
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
    </div>
  );
}

export default Home;
