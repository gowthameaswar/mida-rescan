import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaTachometerAlt, FaStethoscope, FaFileMedical, FaUserCircle, FaSignOutAlt } from 'react-icons/fa'; // Importing icons
import './Header.css';

const Header = () => {
    const [username, setUsername] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [showMenu, setShowMenu] = useState(false); 
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:5000/api/staff/profile')  
            .then(response => {
                setUsername(response.data.name); 
            })
            .catch(error => {
                console.error('Error fetching profile:', error);
            });
    }, []);

    const handleLogout = () => {
        axios.post('http://localhost:5000/api/logout')
            .then(() => {
                navigate('/auth/login');  
            })
            .catch(error => {
                console.error('Error logging out:', error);
            });
    };

    return (
        <header>
            <div className="navbar">
                <div className="menu-icon" onClick={() => setShowMenu(!showMenu)}>
                    <div className="line"></div>
                    <div className="line"></div>
                    <div className="line"></div>
                </div>
                <nav className={showMenu ? 'active' : ''}>
                    <ul>
                        <li>
                            <NavLink to="/staff/dashboard" activeClassName="active">
                                <FaTachometerAlt /> Dashboard
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/staff/diagnosis" activeClassName="active">
                                <FaStethoscope /> Diagnosis
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/staff/report-history" activeClassName="active">
                                <FaFileMedical /> Report History
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/staff/profile" activeClassName="active">
                                <FaUserCircle /> Profile
                            </NavLink>
                        </li>
                        <li className="dropdown">
                            <span onClick={() => setShowDropdown(!showDropdown)} className="username">
                                Welcome&nbsp;{username || 'User'}!
                                <span className={`arrow ${showDropdown ? 'open' : ''}`}>▼</span>
                            </span>
                            {showDropdown && (
                                <div className="dropdown-menu">
                                    <button onClick={handleLogout}>
                                        <FaSignOutAlt /> Logout
                                    </button>
                                </div>
                            )}
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
