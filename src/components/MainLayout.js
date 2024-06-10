import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './navbar/Navbar';
import AlertManager from '../components/pop-up/menu/alert/notif/AlertManager';

function MainLayout() {
  return (
    <div className="layout-container">
      <Navbar />
      <AlertManager />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
