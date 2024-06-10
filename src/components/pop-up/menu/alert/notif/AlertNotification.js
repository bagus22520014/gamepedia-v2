import React, { useEffect, useState, forwardRef } from 'react';
import './AlertNotification.css';
import successIcon from '../../../../../asset/icon/success-icon.png';
import warningIcon from '../../../../../asset/icon/warning-icon.png';
import errorIcon from '../../../../../asset/icon/error-icon.png';
import infoIcon from '../../../../../asset/icon/info-icon.png';

const AlertNotification = forwardRef(({ id, type, message, removeAlert, style }, ref) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => removeAlert(id), 500);
    }, 3000);

    return () => clearTimeout(timer);
  }, [id, removeAlert]);

  let icon;
  let title;

  switch (type) {
    case 'success':
      icon = successIcon;
      title = 'Success';
      break;
    case 'warning':
      icon = warningIcon;
      title = 'Warning';
      break;
    case 'error':
      icon = errorIcon;
      title = 'Error';
      break;
    case 'info':
      icon = infoIcon;
      title = 'Info';
      break;
    default:
      icon = null;
      title = '';
      break;
  }

  return (
    <div
      ref={ref}
      className={`alert-notification ${type} ${isVisible ? 'visible' : 'hidden'}`}
      style={style}
    >
      <div className="alert-header">
        {icon && <img src={icon} alt={`${type} icon`} className="alert-icon" />}
        <span className="alert-title">{title}</span>
      </div>
      <div className="alert-message">{message}</div>
    </div>
  );
});

export default AlertNotification;
