import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import './Login.css';
import vectorImage from '../../asset/img/vector/vector.png';
import vector1Image from '../../asset/img/vector/vector-1.jpg';
import closeIcon from '../../asset/icon/close-icon-white.png';
import eyeIcon from '../../asset/icon/eye-icon.png';
import eyeSlashIcon from '../../asset/icon/eye-slash-icon.png';
import facebookLogo from '../../asset/img/auth-logo/facebook-logo.png';
import githubLogo from '../../asset/img/auth-logo/github-logo.png';
import googleLogo from '../../asset/img/auth-logo/google-logo.png';
import microsoftLogo from '../../asset/img/auth-logo/microsoft-logo.png';
import { AlertContext } from '../../components/pop-up/menu/alert/notif/AlertManager';
import { PreviousRouteContext } from '../../App';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { addAlert } = useContext(AlertContext);
  const previousRoute = useContext(PreviousRouteContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      addAlert('success', 'Login successful!');
      navigate('/');
    } catch (error) {
      console.error('Error logging in:', error);
      addAlert('error', 'Login failed. Please check your email and password.');
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleClose = () => {
    if (previousRoute && previousRoute !== '/signup' && previousRoute !== '/login') {
      navigate(previousRoute);
    } else {
      navigate('/');
    }
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
              <form onSubmit={handleLogin}>
                <div className="input-group">
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
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
