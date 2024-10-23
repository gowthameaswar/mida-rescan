import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import StaffManagement from './components/StaffManagement'; // Ensure the path is correct
import AuthLayout from './components/AuthLayout';
import Login from './components/Login';
import Signup from './components/Signup';
import StaffDashboard from './staff/Dashboard';
import StaffProfile from './staff/Profile';
import Diagnosis from './staff/Diagnosis';
import ReportHistory from './staff/ReportHistory';
import ReportDetails from './staff/Report'; // Import ReportDetails correctly

const App = () => {
  return (
    <Routes>
      <Route path="/auth/*" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Route>
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="/admin/staff-management" element={<StaffManagement />} />
      <Route path="/admin/profile" element={<Profile />} />
      <Route path="/staff/dashboard" element={<StaffDashboard />} />
      <Route path="/staff/profile" element={<StaffProfile />} />
      <Route path="/staff/report/:reportId" element={<ReportDetails />} /> {/* Adjusted the path here */}
      <Route path="/staff/diagnosis" element={<Diagnosis />} />
      <Route path="/staff/report-history" element={<ReportHistory />} />
      {/* <Route path="/staff/chat" element={<Chat />} /> */}
    </Routes>
  );
};

export default App;
