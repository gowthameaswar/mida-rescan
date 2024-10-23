import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate to programmatically navigate
import Header from './Header';
import './ReportHistory.css'; // Importing a CSS file for styles

const ReportHistory = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedReportId, setExpandedReportId] = useState(null); // New state for tracking expanded report
    const navigate = useNavigate(); // Initialize the useNavigate hook

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const userResponse = await fetch('http://localhost:5000/api/online-user');
                const userData = await userResponse.json();

                if (userResponse.ok) {
                    const response = await fetch(`http://localhost:5000/api/fetch-reports/${userData.id}`);
                    const data = await response.json();

                    if (response.ok) {
                        setReports(data);
                    } else {
                        setError('Failed to fetch reports.');
                    }
                } else {
                    setError('Failed to fetch user ID.');
                }
            } catch (err) {
                setError('An error occurred while fetching reports.');
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    const handleViewReport = (reportId) => {
        navigate(`/staff/report/${reportId}`); // Programmatically navigate to the report page
    };

    const handleDeleteReport = async (reportId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/delete-report/${reportId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setReports(reports.filter((report) => report.id !== reportId));
            } else {
                setError('Failed to delete the report.');
            }
        } catch (err) {
            setError('An error occurred while deleting the report.');
        }
    };

    const toggleExpanded = (reportId) => {
        setExpandedReportId(expandedReportId === reportId ? null : reportId); // Toggle the expanded report ID
    };

    return (
        <div>
            <Header />
            <div className="report-history-container">
                <h1>Report History</h1>

                {loading && <p>Loading...</p>}
                {error && <p>{error}</p>}

                {!loading && !error && (
                    <div className="report-list">
                        {reports.length > 0 ? (
                            <table className="report-table">
                                <thead>
                                    <tr>
                                        <th>Patient Name</th>
                                        <th>Age</th>
                                        <th>Sex</th>
                                        <th>Phone</th>
                                        <th>Scan Organ</th>
                                        <th>Scan Type</th>
                                        <th>Outcome</th>
                                        <th>Findings</th>
                                        <th>Report ID</th>
                                        <th>Generated On</th>
                                        <th>Actions</th> {/* Updated column for actions */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {reports.map((report) => {
                                        const shortContent = `${report.content.substring(0, 100)}...`; // Preview of the content

                                        return (
                                            <tr key={report.id}>
                                                <td>{report.patientName}</td>
                                                <td>{report.age}</td>
                                                <td>{report.sex}</td>
                                                <td>{report.phone}</td>
                                                <td>{report.organ}</td>
                                                <td>{report.scanType}</td>
                                                <td>{report.outcome}</td>
                                                <td>
                                                    <div onClick={() => toggleExpanded(report.id)} className="findings">
                                                        {expandedReportId === report.id ? report.content : shortContent}
                                                    </div>
                                                </td>
                                                <td>{report.id}</td>
                                                <td>{new Date(report.generatedOn).toLocaleString()}</td>
                                                <td>
                                                    <div className="button-container">
                                                        <button className="view-button" onClick={() => handleViewReport(report.id)}>
                                                            View Report
                                                        </button>
                                                        <button className="delete-button" onClick={() => handleDeleteReport(report.id)}>
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        ) : (
                            <p>No reports found.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportHistory;
