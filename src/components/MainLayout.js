import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './navbar/Navbar';
import AlertManager from '../components/pop-up/menu/alert/notif/AlertManager'; 
function MainLayout() {
  return (
    <div>
      <Navbar />
      <AlertManager /> 
      <Outlet />
    </div>
  );
}

export default MainLayout;
