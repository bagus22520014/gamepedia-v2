import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../../firebaseConfig';
import { setDoc, doc } from 'firebase/firestore';
import './Signup.css';
import vectorImage from '../../asset/img/vector/vector.png';
import vector1Image from '../../asset/img/vector/vector-1.jpg';
import closeIcon from '../../asset/icon/close-icon-white.png';
import eyeIcon from '../../asset/icon/eye-icon.png';
import eyeSlashIcon from '../../asset/icon/eye-slash-icon.png';
import { AlertContext } from '../../components/pop-up/menu/alert/notif/AlertManager';

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const { addAlert } = useContext(AlertContext);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      addAlert('error', 'Passwords do not match');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
      });

      await setDoc(doc(db, "users", user.uid), {
        email: email,
        firstName: firstName,
        lastName: lastName,
        phoneNumber: "",
        online: true
      });

      addAlert('success', 'Signup successful!');
      navigate('/');
    } catch (error) {
      console.error('Error signing up:', error);
      if (error.code === 'auth/email-already-in-use') {
        addAlert('error', 'Email is already in use');
      } else {
        addAlert('error', 'Signup failed. Please try again');
      }
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="vector-background">
          <img src={vectorImage} alt="Vector Background" className="vector-image" />
        </div>
        <div className="signup-card">
          <img src={closeIcon} alt="Close Icon" className="close-icon" onClick={() => navigate('/')} />
          <div className="signup-box">
            <div className="signup-form">
              <h1>Sign Up</h1>
              <div className="signup-prompt">
                <span>Already have an account?</span>
                <Link to="/login" className="login-link">Log In</Link>
              </div>
              <form onSubmit={handleSignup}>
                <div className="input-group">
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="name-group">
                  <div className="input-group">
                    <input
                      type="text"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="input-group">
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="input-group password-group">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {password && (
                    <img
                      src={passwordVisible ? eyeIcon : eyeSlashIcon}
                      alt="Toggle Password Visibility"
                      className="password-toggle-icon"
                      onClick={togglePasswordVisibility}
                    />
                  )}
                </div>
                <div className="input-group password-group">
                  <input
                    type={confirmPasswordVisible ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {confirmPassword && (
                    <img
                      src={confirmPasswordVisible ? eyeIcon : eyeSlashIcon}
                      alt="Toggle Confirm Password Visibility"
                      className="password-toggle-icon"
                      onClick={toggleConfirmPasswordVisibility}
                    />
                  )}
                </div>
                <div className="button">
                  <button type="submit" className="signup-button">Sign Up</button>
                </div>
              </form>
            </div>
          </div>
          <div className="signup-image">
            <img src={vector1Image} alt="Vector 1" className="vector1-image" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
