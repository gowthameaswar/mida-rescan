
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('admin'); // Default to admin
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password, userType });
      alert(response.data.message); // Display success message
      if (userType === 'admin') {
        navigate('/admin/dashboard'); // Redirect to admin dashboard
      }
      else{
        navigate('/staff/dashboard')
      }
      // Implement staff dashboard redirection if needed
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
        <input
          type="password"
          className="auth-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit" className="auth-button">Login</button>
        {error && <p>{error}</p>}
      </form>
      <p>New to us? <a href="/auth/signup">Sign up here</a></p>
    </div>
  );
};

export default Login;