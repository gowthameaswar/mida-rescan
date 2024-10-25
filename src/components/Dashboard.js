import React, { useState, useEffect } from 'react';
import Header from './Header';
import './Dashboard.css'; // Ensure you have this CSS file for styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faHospital, faUserMd, faUserCheck } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date().toLocaleString());
  const [hospitalName, setHospitalName] = useState('');
  const [staffMembers, setStaffMembers] = useState([]);
  const [staffCount, setStaffCount] = useState(0);

  useEffect(() => {
    const updateDateTime = () => {
      setCurrentDateTime(new Date().toLocaleString());
    };

    // Update date-time every second
    const intervalId = setInterval(updateDateTime, 1000);

    // Fetch hospital name and staff members
    fetchHospitalName();
    fetchStaffMembers();

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, []);

  const fetchHospitalName = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/profile');
      if (response.ok) {
        const data = await response.json();
        setHospitalName(data.name);
      } else {
        console.error('Failed to fetch hospital name');
      }
    } catch (error) {
      console.error('Error fetching hospital name:', error);
    }
  };

  const fetchStaffMembers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/staff');
      if (response.ok) {
        const data = await response.json();
        setStaffMembers(data);
        setStaffCount(data.length); // Set the staff count
      } else {
        console.error('Failed to fetch staff members');
      }
    } catch (error) {
      console.error('Error fetching staff members:', error);
    }
  };

  return (
    <div className="dashboard">
      <Header />
      <div className="date-time-widget">
        <h2>
          <FontAwesomeIcon icon={faClock} /> Current Date and Time
        </h2>
        <p>{currentDateTime}</p>
      </div>
      <div className="hospital-info">
        <div className="hospital-bar">
          <h2>
            <FontAwesomeIcon icon={faHospital} /> {hospitalName}
          </h2>
        </div>
      </div>
      <div className="staff-list">
        <h2>
          <FontAwesomeIcon icon={faUserMd} /> Staff Members: {staffCount}
        </h2>
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {staffMembers.map((staff, index) => (
              <tr key={staff.id}>
                <td>{index + 1}</td>
                <td>{staff.name}</td>
                <td>{staff.email}</td>
                <td>{staff.role}</td>
                <td>
                  <span className="status-active">
                    <FontAwesomeIcon icon={faUserCheck} /> Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
  