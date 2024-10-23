import React, { useState, useEffect } from 'react';
import Header from './Header';
import './StaffManagement.css';

const StaffManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [staffName, setStaffName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Report Access');
  const [staffMembers, setStaffMembers] = useState([]);

  useEffect(() => {
    fetchStaffMembers();
  }, []);

  const fetchStaffMembers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/staff');
      if (response.ok) {
        const data = await response.json();
        setStaffMembers(data);
      } else {
        console.error('Failed to fetch staff members');
      }
    } catch (error) {
      console.error('Error fetching staff members:', error);
    }
  };

  const handleAddStaffClick = () => setShowForm(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const response = await fetch('http://localhost:5000/api/admin/add-staff', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ staffName, email, role, password }),
    });

    if (response.ok) {
      alert('Staff added successfully');
      setShowForm(false);
      // Clear form fields
      setStaffName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setRole('Report Access');
      // Refresh staff list
      fetchStaffMembers();
    } else {
      alert('Error adding staff');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/delete-staff/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert('Staff deleted successfully');
        // Refresh staff list
        fetchStaffMembers();
      } else {
        console.error('Failed to delete staff member');
      }
    } catch (error) {
      console.error('Error deleting staff member:', error);
    }
  };

  return (
    <div className="staff-management">
      <Header />
      <div className="add-staff-button">
        <button onClick={handleAddStaffClick}>Add Staff</button>
      </div>
      <div className="staff-list">
        <h2>Staff Members</h2>
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
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
                  <button onClick={() => handleDelete(staff.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>Staff members: {staffMembers.length} of them</p>
      </div>
      {showForm && (
        <form className="add-staff-form" onSubmit={handleSubmit}>
          <label htmlFor="staffName">Staff Name</label>
          <input
            type="text"
            id="staffName"
            value={staffName}
            onChange={(e) => setStaffName(e.target.value)}
            required
          />
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="password">Set Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <label htmlFor="role">Role</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled
          >
            <option>Report Access</option>
          </select>
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
};

export default StaffManagement;
