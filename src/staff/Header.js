import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Header.css';

const Header = () => {
    const [username, setUsername] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [showMenu, setShowMenu] = useState(false); // State to control the hamburger menu
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:5000/api/staff/profile')  // Adjust the endpoint if necessary
            .then(response => {
                setUsername(response.data.name); // Adjust according to the response structure
            })
            .catch(error => {
                console.error('Error fetching profile:', error);
            });
    }, []);

    const handleLogout = () => {
        axios.post('http://localhost:5000/api/logout')
            .then(() => {
                navigate('/auth/login');  // Redirect to login page
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
                                Dashboard
                            </NavLink>
                        </li>
                        
                        <li>
                            <NavLink to="/staff/diagnosis" activeClassName="active">
                                Diagnosis
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/staff/report-history" activeClassName="active">
                                Report History
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/staff/profile" activeClassName="active">
                                Profile
                            </NavLink>
                        </li>
                        <li className="dropdown">
                            <span onClick={() => setShowDropdown(!showDropdown)} className="username">
                                Welcome&nbsp;{username || 'User'}!
                                <span className={`arrow ${showDropdown ? 'open' : ''}`}>▼</span>
                            </span>
                            {showDropdown && (
                                <div className="dropdown-menu">
                                    <button onClick={handleLogout}>Logout</button>
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
