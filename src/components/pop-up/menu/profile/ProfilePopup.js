import React, { useEffect, useState } from 'react';
import './ProfilePopup.css';
import defaultProfilePic from '../../../../asset/img/profile-picture/default-pp.png';
import closeIcon from '../../../../asset/icon/close-icon.png';
import { getAuth, signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../firebaseConfig';
import EditProfilePopup from '../editProfile/EditProfilePopup';

const ProfilePopup = ({ user, onClose }) => {
  const [online, setOnline] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    displayName: user?.displayName || user?.email || "User",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setOnline(data.online);
        setUserInfo({
          firstName: data.firstName,
          lastName: data.lastName,
          displayName: `${data.firstName} ${data.lastName}`,
        });
      }
    };

    fetchUserData();
  }, [user]);

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await updateDoc(doc(db, "users", user.uid), { online: false });
      await signOut(auth);
      onClose();
    } catch (error) {
      console.error("Logout failed: ", error);
      alert("Logout failed: " + error.message);
    }
  };

  const handleEditProfile = () => {
    setShowEditProfile(true);
  };

  const closeEditProfile = () => {
    setShowEditProfile(false);
  };

  const handleUserInfoUpdate = (updatedUserInfo) => {
    setUserInfo({
      ...userInfo,
      ...updatedUserInfo,
      displayName: `${updatedUserInfo.firstName} ${updatedUserInfo.lastName}`,
    });
    setOnline(updatedUserInfo.online);
  };

  return (
    <div className="profile-popup">
      <div className="profile-popup-content">
        <button className="close-button" onClick={onClose}>
          <img src={closeIcon} alt="Close Icon" className="close-icon-img" />
        </button>
        <img
          src={user?.photoURL || defaultProfilePic}
          alt="Profile"
          className={`profile-picture ${online ? 'online' : ''}`}
        />
        <h2>{userInfo.displayName}</h2>
        <button className="edit-profile-button" onClick={handleEditProfile}>Edit Profile</button>
        <button className="logout-button" onClick={handleLogout}>Log Out</button>
      </div>
      {showEditProfile && <EditProfilePopup user={user} onClose={closeEditProfile} onUpdateUserInfo={handleUserInfoUpdate} />}
    </div>
  );
};

export default ProfilePopup;
