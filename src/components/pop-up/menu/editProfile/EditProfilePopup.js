import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getAuth, signOut, deleteUser } from 'firebase/auth';
import { db } from '../../../../firebaseConfig';
import './EditProfilePopup.css';
import closeIcon from '../../../../asset/icon/close-icon.png';

const EditProfilePopup = ({ user, onClose, onUpdateUserInfo }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [online, setOnline] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setPhoneNumber(data.phoneNumber);
        setOnline(data.online);
      }
    };
    fetchUserData();
  }, [user.uid]);

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        phoneNumber: Number(phoneNumber),
        online,
      });
      onUpdateUserInfo({ firstName, lastName, online });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile: ", error);
      alert("Error updating profile");
    }
  };

  const handleDelete = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    try {
      // Menghapus dokumen pengguna dari Firestore
      await deleteDoc(doc(db, "users", user.uid));

      // Menghapus akun pengguna dari Firebase Authentication
      await deleteUser(currentUser);

      // Logout pengguna
      await signOut(auth);

      // Menutup popup
      onClose();
    } catch (error) {
      console.error("Error deleting account: ", error);
      alert("Error deleting account. Please make sure you are logged in and try again.");
    }
  };

  const handleEdit = () => {
    if (isEditing) {
      handleSave();
    } else {
      setIsEditing(true);
    }
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value)) {
      setPhoneNumber(value);
    }
  };

  const handleToggleOnline = () => {
    setOnline(!online);
  };

  return (
    <div className="edit-profile-popup">
      <div className="edit-profile-popup-content">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h2>Edit Profile</h2>
          <button className="close-button" onClick={onClose}>
            <img src={closeIcon} alt="Close Icon" className="close-icon-img" />
          </button>
        </div>
        <div className="input-group">
          <label>Email</label>
          <input type="email" value={user.email} disabled />
        </div>
        <div className="input-group">
          <label>First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div className="input-group">
          <label>Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div className="input-group">
          <label>Phone Number</label>
          <input
            type="number"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            disabled={!isEditing}
          />
        </div>
        <div className="input-group-online-status">
          <label>Online Status</label>
        </div>
        <div className="online-status-container">
          <h3 className="online-status-label">{online ? 'Online' : 'Offline'}</h3>
          <label className="switch">
            <input
              type="checkbox"
              checked={online}
              onChange={handleToggleOnline}
              disabled={!isEditing}
            />
            <span className="slider"></span>
          </label>
        </div>
        <div className="button-group">
          <button className="edit-button" onClick={handleEdit}>
            {isEditing ? "Save" : "Edit"}
          </button>
          <button className="delete-button" onClick={handleDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePopup;
