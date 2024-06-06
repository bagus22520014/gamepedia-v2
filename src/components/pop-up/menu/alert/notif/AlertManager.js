import React, { createContext, useState, useEffect, useRef } from 'react';
import AlertNotification from './AlertNotification';
import './AlertManager.css';

export const AlertContext = createContext();

const AlertManager = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  const alertRefs = useRef({});

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

  useEffect(() => {
    alerts.forEach((alert, index) => {
      const alertElement = alertRefs.current[alert.id];
      if (alertElement) {
        const offset = alerts.slice(0, index).reduce((acc, alert) => {
          const prevAlertElement = alertRefs.current[alert.id];
          return acc + (prevAlertElement ? prevAlertElement.getBoundingClientRect().height + 10 : 0);
        }, 0);
        alertElement.style.bottom = `${offset}px`;
      }
    });
  }, [alerts]);

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
            ref={el => alertRefs.current[alert.id] = el}
          />
        ))}
      </div>
      {children}
    </AlertContext.Provider>
  );
};

export default AlertManager;
