import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../../asset/img/logo/gp logo 3.png';
import searchIcon from '../../asset/icon/search-icon.png';
import bellIcon from '../../asset/icon/bell-icon.png';  
import settingsIcon from '../../asset/icon/settings-icon.png'; 

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/">
        <img src={logo} alt="Home Logo" className="navbar-logo" />
      </Link>
      <div className="navbar-search">
        <input type="text" placeholder="Search..." className="search-input" />
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
          <Link to="" className="login-button">Login</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
