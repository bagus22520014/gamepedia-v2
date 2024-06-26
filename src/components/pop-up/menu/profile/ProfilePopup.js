import React, { useEffect, useState, useContext } from 'react';
import Portal from '../../../Portal';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../firebaseConfig';
import EditProfilePopup from '../editProfile/EditProfilePopup';
import AlertConfirmation from '../alert/confirm/AlertConfirmation';
import { AlertContext } from '../alert/notif/AlertManager';
import './ProfilePopup.css';
import defaultProfilePic from '../../../../asset/img/profile-picture/default-pp.png';
import closeIcon from '../../../../asset/icon/close-icon-white.png';

const ProfilePopup = ({ user, onClose }) => {
  const [online, setOnline] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    displayName: user?.displayName || user?.email || "User",
  });

  const { addAlert } = useContext(AlertContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setOnline(data.online);
        setIsAdmin(data.isAdmin || false);
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
      addAlert('success', 'Successfully logged out');
      navigate('/');
      onClose();
    } catch (error) {
      console.error("Logout failed: ", error);
      addAlert('error', `Logout failed: ${getErrorMessage(error)}`);
    }
  };

  const handleEditProfile = () => {
    if (isAdmin) {
      onClose();
      navigate('/games');
    } else {
      setShowEditProfile(true);
    }
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

  const showLogoutConfirmationDialog = () => {
    setShowLogoutConfirmation(true);
  };

  const hideLogoutConfirmationDialog = () => {
    setShowLogoutConfirmation(false);
  };

  const confirmLogout = () => {
    handleLogout();
    hideLogoutConfirmationDialog();
  };

  const getErrorMessage = (error) => {
    switch (error.code) {
      case 'auth/network-request-failed':
        return 'Network error, please try again.';
      case 'auth/user-token-expired':
        return 'Your session has expired. Please log in again.';
      case 'auth/user-not-found':
        return 'User not found. Please check your credentials.';
      case 'auth/too-many-requests':
        return 'Too many requests. Please try again later.';
      default:
        return 'An unknown error occurred. Please try again.';
    }
  };

  return (
    <Portal>
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
          <button className="edit-profile-button" onClick={handleEditProfile}>
            {isAdmin ? 'Add Game' : 'Edit Profile'}
          </button>
          <button className="logout-button" onClick={showLogoutConfirmationDialog}>Log Out</button>
        </div>
        {showEditProfile && (
          <EditProfilePopup
            user={user}
            onClose={closeEditProfile}
            onUpdateUserInfo={handleUserInfoUpdate}
          />
        )}
        {showLogoutConfirmation && (
          <AlertConfirmation
            title="Confirm Logout"
            message="Are you sure you want to log out?"
            onConfirm={confirmLogout}
            onCancel={hideLogoutConfirmationDialog}
          />
        )}
      </div>
    </Portal>
  );
};

export default ProfilePopup;
