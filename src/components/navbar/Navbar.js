import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../../asset/img/logo/gp logo 3.png';
import searchIcon from '../../asset/icon/search-icon.png';
import bellIcon from '../../asset/icon/bell-icon.png';
import settingsIcon from '../../asset/icon/settings-icon.png';
import closeIcon from '../../asset/icon/close-icon.png';
import defaultProfilePic from '../../asset/img/profile-picture/default-pp.png';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import ProfilePopup from '../pop-up/menu/profile/ProfilePopup';
import { AlertContext } from '../../components/pop-up/menu/alert/notif/AlertManager';

function Navbar() {
  const [searchInputActive, setSearchInputActive] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [online, setOnline] = useState(false);
  const { addAlert } = useContext(AlertContext);
  const alertTriggered = useRef(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUser(user);
        subscribeToUserData(user.uid);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  const subscribeToUserData = (uid) => {
    const userDocRef = doc(db, "users", uid);
    const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setOnline(data.online);
      }
    });

    return () => {
      unsubscribe();
    };
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === '/') {
        event.preventDefault();
        if (!searchInputActive) {
          document.getElementById('searchInput').focus();
          setSearchInputActive(true);
        } else {
          document.getElementById('searchInput').value += '/';
        }
      } else if (!searchInputActive && !alertTriggered.current) {
        addAlert('info', 'Press [/] to jump to the search box');
        alertTriggered.current = true;
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [searchInputActive, addAlert]);

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchValue('');
    document.getElementById('searchInput').focus();
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo-container">
        <Link to="/">
          <img src={logo} alt="Home Logo" className="navbar-logo" />
        </Link>
      </div>
      <div className="navbar-search-container">
        <div className="navbar-search">
          <input
            type="text"
            id="searchInput"
            placeholder="Search..."
            className="search-input"
            onBlur={() => setSearchInputActive(false)}
            value={searchValue}
            onChange={handleInputChange}
          />
          {searchValue && (
            <button className="clear-button" onClick={handleClearSearch}>
              <img src={closeIcon} alt="Clear Icon" className="close-icon" />
            </button>
          )}
          <button className="search-button">
            <img src={searchIcon} alt="Search Icon" className="search-icon" />
          </button>
        </div>
      </div>
      <div className='navbar-tools'>
        <div className="navbar-icons">
          <button className='icon-background'>
            <img src={bellIcon} alt="Notification Icon" className="bell-icon" />
          </button>
          <button className='icon-background'>
            <img src={settingsIcon} alt="Settings Icon" className="settings-icon" />
          </button>
        </div>
        {isLoggedIn ? (
          <div className="profile-container">
            <img
              src={user?.photoURL || defaultProfilePic}
              alt="Profile"
              className={`profile-picture ${online ? 'online' : ''}`}
              onClick={togglePopup}
            />
            {showPopup && <ProfilePopup user={user} onClose={togglePopup} />}
          </div>
        ) : (
          <div className="navbar-auth">
            <Link to="/signup" className="signup-button">Sign Up</Link>
            <Link to="/login" className="login-button">Log In</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
