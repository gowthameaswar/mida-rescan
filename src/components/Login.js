import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('admin'); // Default to admin
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password, userType });
      alert(response.data.message); // Display success message
      if (userType === 'admin') {
        navigate('/admin/dashboard'); // Redirect to admin dashboard
      } else {
        navigate('/staff/dashboard');
      }
    } catch (error) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="auth-form">
      <h2>Welcome back!</h2>
      <form onSubmit={handleLogin}>
        <select
          className="auth-input select" // Updated with className for custom styling
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
          required
        >
          <option value="admin">Admin</option>
          <option value="staff">Staff</option>
        </select>
        <input
          type="email"
          className="auth-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        
        <div className="password-container">
          <input
            type={showPassword ? 'text' : 'password'} // Toggle between password and text
            className="auth-input password-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        </div>

        <button type="submit" className="auth-button">Login</button>
        {error && <p>{error}</p>}
      </form>
      <p>New to us? <a href="/auth/signup">Sign up here</a></p>
    </div>
  );
};

export default Login;
