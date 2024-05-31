import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../../asset/img/logo/gp logo 3.png';
import searchIcon from '../../asset/icon/search-icon.png';
import bellIcon from '../../asset/icon/bell-icon.png';  
import settingsIcon from '../../asset/icon/settings-icon.png';  
import closeIcon from '../../asset/icon/close-icon.png';

function Navbar() {
  const [searchInputActive, setSearchInputActive] = useState(false);
  const [searchValue, setSearchValue] = useState('');

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
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [searchInputActive]);

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchValue('');
    document.getElementById('searchInput').focus();
  };

  return (
    <nav className="navbar">
      <Link to="/">
        <img src={logo} alt="Home Logo" className="navbar-logo" />
      </Link>
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
      <div className='navbar-tools'>
        <div className="navbar-icons">
          <button className='icon-background'>
            <img src={bellIcon} alt="Notification Icon" className="bell-icon" />
          </button>
          <button className='icon-background'>
            <img src={settingsIcon} alt="Settings Icon" className="settings-icon" />
          </button>
        </div>
        <div className="navbar-auth">
          <Link to="/signup" className="signup-button">Sign Up</Link>
          <Link to="/login" className="login-button">Log In</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
