import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/profile');
        setProfile(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div>
      <Header />
      <div className="profile-container"> {/* Updated class name for consistency */}
        {loading ? (
          <div className="loading-spinner"></div>
        ) : (
          <>
            <h2>Profile</h2>
            {profile ? (
              <div className="profile-details"> {/* Apply box styling */}
                <p><strong>Hospital ID:</strong> {profile.hospitalId}</p>
                <p><strong>Hospital Name:</strong> {profile.name}</p>
                <p><strong>Location:</strong> {profile.location}</p>
                <p><strong>Staff Size:</strong> {profile.staffSize}</p>
                <p><strong>Admin Email:</strong> {profile.adminEmail}</p>
              </div>
            ) : (
              <p>No profile data available.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
