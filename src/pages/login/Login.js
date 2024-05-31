import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import vectorImage from '../../asset/img/vector/vector.png';
import vector1Image from '../../asset/img/vector/vector-1.jpg';
import closeIcon from '../../asset/icon/close-icon.png';
import eyeIcon from '../../asset/icon/eye-icon.png';
import eyeSlashIcon from '../../asset/icon/eye-slash-icon.png';
import facebookLogo from '../../asset/img/auth-logo/facebook-logo.png';
import githubLogo from '../../asset/img/auth-logo/github-logo.png';
import googleLogo from '../../asset/img/auth-logo/google-logo.png';
import microsoftLogo from '../../asset/img/auth-logo/microsoft-logo.png';

const Login = () => {
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState('');

  const handleClose = () => {
    navigate('/');
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="vector-background">
          <img src={vectorImage} alt="Vector Background" className="vector-image" />
        </div>
        <div className="login-card">
          <img src={closeIcon} alt="Close Icon" className="close-icon" onClick={handleClose} />
          <div className="login-box">
            <div className="login-form">
              <h1>Log In</h1>
              <div className="login-prompt">
                <span>Don't have an account?</span>
                <Link to="/signup" className="signup-link">Sign up</Link>
              </div>
              <form>
                <div className="input-group">
                  <input type="email" placeholder="Email" />
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
                <div className="button">
                  <button type="button" className="forgot-password-button">Forgot Password?</button>
                  <button type="submit" className="login-button">Log In</button>
                </div>
              </form>
              <div className="divider">
                <span>OR</span>
              </div>
              <div className="social-login">
                <div className="social-row">
                  <button className="social-button google-button">
                    <span>Google</span>
                    <img src={googleLogo} alt="Google Logo" className="social-logo" />
                  </button>
                  <button className="social-button microsoft-button">
                    <span>Microsoft</span>
                    <img src={microsoftLogo} alt="Microsoft Logo" className="social-logo" />
                  </button>
                </div>
                <div className="social-row">
                  <button className="social-button facebook-button">
                    <span>Facebook</span>
                    <img src={facebookLogo} alt="Facebook Logo" className="social-logo" />
                  </button>
                  <button className="social-button github-button">
                    <span>GitHub</span>
                    <img src={githubLogo} alt="GitHub Logo" className="social-logo" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="login-image">
            <img src={vector1Image} alt="Vector 1" className="vector1-image" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
