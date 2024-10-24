import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Signup = () => {
  const [hospitalName, setHospitalName] = useState('');
  const [location, setLocation] = useState('');
  const [staffSize, setStaffSize] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsChecked, setTermsChecked] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!termsChecked) {
      setError('You must agree to the terms and conditions');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/hospital/register', { hospitalName, location, staffSize, adminEmail, password });
      navigate('/auth/login'); // Redirect to login page
    } catch (error) {
      setError('Signup failed');
    }
  };

  return (
    <div className="auth-form">
      <h2>Register Hospital</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          className="auth-input"
          value={hospitalName}
          onChange={(e) => setHospitalName(e.target.value)}
          placeholder="Hospital Name"
          required
        />
        <input
          type="text"
          className="auth-input"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          required
        />
        <select
          className="auth-input"
          value={staffSize}
          onChange={(e) => setStaffSize(e.target.value)}
          required
        >
          <option value="" disabled>Select Staff Size</option>
          <option value="small">Small (1-50)</option>
          <option value="medium">Medium (51-200)</option>
          <option value="large">Large (201+)</option>
        </select>
        <input
          type="email"
          className="auth-input"
          value={adminEmail}
          onChange={(e) => setAdminEmail(e.target.value)}
          placeholder="Admin Email"
          required
        />

        <div className="password-container">
          <input
            type={showPassword ? 'text' : 'password'} // Toggle between password and text
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        </div>

        <div className="password-container">
          <input
            type={showConfirmPassword ? 'text' : 'password'} // Toggle confirm password visibility
            className="auth-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
          </button>
        </div>

        <div className="terms-container">
          <input
            type="checkbox"
            id="terms"
            checked={termsChecked}
            onChange={(e) => setTermsChecked(e.target.checked)}
            required
          />
          <label htmlFor="terms">
            I agree to the
            <a href="/terms" target="_blank" rel="noopener noreferrer"> Terms and Conditions</a>
          </label>
        </div>
        <button type="submit" className="auth-button">Register</button>
        {error && <p>{error}</p>}
      </form>
      <p>Already have an account? <a href="/auth/login">Login here</a></p>
    </div>
  );
};

export default Signup;
