import React, { createContext, useState } from 'react';
import AlertNotification from './AlertNotification';
import './AlertManager.css';

export const AlertContext = createContext();

const AlertManager = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const addAlert = (type, message) => {
    const id = new Date().getTime();
    setAlerts(prevAlerts => [
      { id, type, message },
      ...prevAlerts
    ]);
  };

  const removeAlert = (id) => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id));
  };

  return (
    <AlertContext.Provider value={{ addAlert }}>
      <div className="alert-manager">
        {alerts.map((alert, index) => (
          <AlertNotification
            key={alert.id}
            id={alert.id}
            type={alert.type}
            message={alert.message}
            removeAlert={removeAlert}
            style={{ bottom: `${index * 120}px` }} 
          />
        ))}
      </div>
      {children}
    </AlertContext.Provider>
  );
};

export default AlertManager;
