import React, { useEffect, useState } from 'react';
import Header from './Header';
import axios from 'axios';
import './Profile.css'; // Optional: Add styles for the profile page

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [showPasswordModal, setShowPasswordModal] = useState(false); // Control modal visibility
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

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
            email: profile.email,  // Fetch email from profile
            userType: 'staff',      // Pre-fill as 'staff'
            oldPassword,
            newPassword
        }).then(response => {
            alert('Password changed successfully. A confirmation email has been sent.');
    
            // Clear the password fields after success
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setPasswordError(''); // Clear any error messages
            setShowPasswordModal(false); // Hide the modal after success
        }).catch(error => {
            setPasswordError(error.response?.data?.error || 'Error changing password');
        });
    };
    
    return (
        <div>
            <Header />
            <div className="profile-container">
                {loading ? (
                    <div className="loading-spinner"></div> // Spinner with correct class name
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
                                <br></br>
                                <button onClick={() => setShowPasswordModal(true)} className="change-password-button">
                                    Change Password
                                </button>
                            </div>
                        ) : (
                            <p>No profile data available.</p>
                        )}
                    </>
                )}

                {/* Password Change Modal */}
                {showPasswordModal && (
                    <div className="password-modal-overlay">
                        <div className="password-modal">
                            <h2>Change Password</h2>
                            {passwordError && <p className="error">{passwordError}</p>}

                            {/* Display email (non-editable) */}
                            <input
                                type="email"
                                value={profile?.email || ''}
                                readOnly
                                className="non-clickable-field"
                            />

                            {/* Display user type (non-editable) */}
                            <input
                                type="text"
                                value="staff"
                                readOnly
                                className="non-clickable-field"
                            />

                            <input
                                type="password"
                                placeholder="Old Password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <button onClick={handlePasswordChange}>Submit</button>
                            <button onClick={() => setShowPasswordModal(false)}>Cancel</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;