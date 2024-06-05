import React from 'react';
import './AlertConfirmation.css';
import closeIcon from '../../../../../asset/icon/close-icon-white.png';
import warningIcon from '../../../../../asset/icon/warning-icon.png';

const AlertConfirmation = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="alert-confirmation-overlay">
      <div className="alert-confirmation">
        <div className="alert-confirmation-header">
          <div className="header-content">
            <img src={warningIcon} alt="Warning Icon" className="warning-icon" />
            <h2>{title}</h2>
          </div>
          <button className="close-button" onClick={onCancel}>
            <img src={closeIcon} alt="Close Icon" className="close-icon-img" />
          </button>
        </div>
        <div className="alert-confirmation-body">
          <p>{message}</p>
        </div>
        <div className="alert-confirmation-footer">
          <button className="cancel-button" onClick={onCancel}>Cancel</button>
          <button className="confirm-button" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default AlertConfirmation;
