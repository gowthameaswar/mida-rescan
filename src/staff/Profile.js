// Profile.js
import React, { useEffect, useState } from 'react';
import Header from './Header';
import axios from 'axios';
import './Profile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:5000/api/staff/profile')
            .then(response => {
                setProfile(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError(error.response?.data?.error || 'Error fetching profile');
                setLoading(false);
            });
    }, []);

    const handlePasswordChange = () => {
        if (newPassword !== confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        }

        axios.post('http://localhost:5000/api/staff/change-password', {
            email: profile.email,
            userType: 'staff',
            oldPassword,
            newPassword
        }).then(response => {
            alert('Password changed successfully. A confirmation email has been sent.');

            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setPasswordError('');
            setShowPasswordModal(false);
        }).catch(error => {
            setPasswordError(error.response?.data?.error || 'Error changing password');
        });
    };

    return (
        <div className="profile-page">
            <Header />
            <div className="profile-container">
                {loading ? (
                    <div className="loading-spinner"></div>
                ) : (
                    <>
                        {error && <p className="error">{error}</p>}
                        {profile ? (
                            <div className="profile-details">
                                <h1>Profile</h1>
                                <p><strong>Name:</strong> {profile.name}</p>
                                <p><strong>Email:</strong> {profile.email}</p>
                                <p><strong>Role:</strong> {profile.role}</p>
                                <p><strong>Hospital Name:</strong> {profile.hospitalName}</p>
                                <button 
                                    className="custom-change-password-button"
                                    onClick={() => setShowPasswordModal(true)}>
                                    Change Password
                                </button>
                            </div>
                        ) : (
                            <p>No profile data available.</p>
                        )}
                    </>
                )}

                {showPasswordModal && (
                    <div className="password-modal-overlay">
                        <div className="password-modal">
                            <h2>Change Password</h2>
                            {passwordError && <p className="error">{passwordError}</p>}
                            <input
                                type="email"
                                value={profile?.email || ''}
                                readOnly
                                className="non-clickable-field"
                            />
                            <input
                                type="text"
                                value="staff"
                                readOnly
                                className="non-clickable-field"
                            />
                            <div className="password-container">
                                <input
                                    type={showOldPassword ? 'text' : 'password'}
                                    placeholder="Old Password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowOldPassword(!showOldPassword)}
                                >
                                    <FontAwesomeIcon icon={showOldPassword ? faEyeSlash : faEye} />
                                </button>
                            </div>
                            <div className="password-container">
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                    <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
                                </button>
                            </div>
                            <div className="password-container">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Confirm New Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                                </button>
                            </div>
                            <button 
                                className="custom-password-modal-button"
                                onClick={handlePasswordChange}>Submit</button>
                            <button 
                                className="custom-password-modal-button"
                                onClick={() => setShowPasswordModal(false)}>Cancel</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
