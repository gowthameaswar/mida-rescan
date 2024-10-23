import React, { useEffect, useState } from 'react';
import Header from './Header';
import axios from 'axios';
import './Dashboard.css'; // Add custom CSS for the dashboard

const Dashboard = () => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

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

    const getResultPhrase = (sex) => {
        return sex === 'Male' ? 'his result is' : 'her result is';
    };

    return (
        <div>
            <Header />
            <div className="dashboard-container">
                {loading ? (
                    <div className="loading-spinner"></div>
                ) : (
                    <>
                        {error && <p className="error">{error}</p>}
                        {profile ? (
                            <div className="dashboard-content">
                                <h1>Welcome, {profile.name}</h1>
                                <div className="dashboard-info">
                                    <div className="profile-card">
                                        <h2>Your Profile</h2>
                                        <p><strong>Hospital:</strong> {profile.hospitalName}</p>
                                        <p><strong>Email:</strong> {profile.email}</p>
                                        {/* <p><strong>Phone:</strong> {profile.phone}</p> */}
                                    </div>
                                    <br></br>

                                    <div className="stats-card">
                                        <h2>Overview</h2>
                                        <div className="stats-grid">
                                            <div className="stat-item">
                                                <h3>Reports Submitted</h3>
                                                <p>{profile.reportsSubmitted}</p> {/* Dynamic value */}
                                            </div>
                                            
                                            <div className="stat-item">
                                                <h3>Total Patients</h3>
                                                <p>{profile.totalPatients}</p> {/* Dynamic value */}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="recent-activity">
                                    <h2>Recent Activity</h2>
                                    {profile.latestActivity ? (
                                        <p>
                                            Submitted {profile.latestActivity.scanType} scan of {profile.latestActivity.patientName} and {getResultPhrase(profile.latestActivity.sex)} {profile.latestActivity.outcome}.
                                        </p>
                                    ) : (
                                        <p>No recent activity available</p>
                                    )}
                                </div>
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

export default Dashboard;
