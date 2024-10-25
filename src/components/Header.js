import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faUsers, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/logout'); // Ensure this URL matches your backend logout route
      navigate('/auth/login'); // Redirect to login page or wherever you want after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className="header">
      <nav>
        <ul>
          <li>
            <NavLink to="/admin/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
              <FontAwesomeIcon icon={faTachometerAlt} /> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/staff-management" className={({ isActive }) => (isActive ? 'active' : '')}>
              <FontAwesomeIcon icon={faUsers} /> Staff Management
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/profile" className={({ isActive }) => (isActive ? 'active' : '')}>
              <FontAwesomeIcon icon={faUser} /> Profile
            </NavLink>
          </li>
          <li className="logout-button">
            <button onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} /> Logout
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
