import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';
import vectorImage from '../../asset/img/vector/vector.png';
import vector1Image from '../../asset/img/vector/vector-1.jpg';
import closeIcon from '../../asset/icon/close-icon.png';
import eyeIcon from '../../asset/icon/eye-icon.png';
import eyeSlashIcon from '../../asset/icon/eye-slash-icon.png';

const Signup = () => {
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleClose = () => {
    navigate('/');
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
          <img src={closeIcon} alt="Close Icon" className="close-icon" onClick={handleClose} />
          <div className="signup-box">
            <div className="signup-form">
              <h1>Sign Up</h1>
              <div className="signup-prompt">
                <span>Already have an account?</span>
                <Link to="/login" className="login-link">Log In</Link>
              </div>
              <form>
                <div className="input-group">
                  <input type="email" placeholder="Email" />
                </div>
                <div className="name-group">
                  <div className="input-group">
                    <input type="text" placeholder="First Name" />
                  </div>
                  <div className="input-group">
                    <input type="text" placeholder="Last Name" />
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
