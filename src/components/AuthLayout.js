import React from 'react';
import { Outlet } from 'react-router-dom';
import './AuthLayout.css';
import panelImage from '../assets/panel.png'; // Update the path as per your project structure

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <div className="auth-info">
        <img src={panelImage} alt="Branding Panel" className="panel-image" />
      </div>
      <div className="auth-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
