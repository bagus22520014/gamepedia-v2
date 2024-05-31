// components/pop-up/menu/profile/ProfilePopup.js
import React, { useEffect } from 'react';
import './ProfilePopup.css';
import defaultProfilePic from '../../../../asset/img/profile-picture/default-pp.png';
import closeIcon from '../../../../asset/icon/close-icon.png';
import { getAuth, signOut } from 'firebase/auth';

const ProfilePopup = ({ user, onClose }) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-popup') && !event.target.closest('.profile-picture')) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      onClose();
    }).catch((error) => {
      console.error("Logout failed: ", error);
    });
  };

  return (
    <div className="profile-popup">
      <div className="profile-popup-content">
        <button className="close-button" onClick={onClose}>
          <img src={closeIcon} alt="Close Icon" className="close-icon-img" />
        </button>
        <img src={user?.photoURL || defaultProfilePic} alt="Profile" className="profile-picture" />
        <h2>{user?.displayName || "User Name"}</h2>
        <button className="edit-profile-button">Edit Profile</button>
        <button className="logout-button" onClick={handleLogout}>Log Out</button>
      </div>
    </div>
  );
};

export default ProfilePopup;
