import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header'; // Import the Header component
import './Report.css';

const ReportDetails = () => {
    const { reportId } = useParams();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/fetch-report/${reportId}`);
                const data = await response.json();

                if (response.ok) {
                    setReport(data);
                } else {
                    setError('Failed to fetch the report.');
                }
            } catch (err) {
                setError('An error occurred while fetching the report.');
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [reportId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <Header /> {/* Include the Header component */}
            <div className="report-details-container">
                <h1>Report Details</h1>

                {/* Patient Information Table */}
                <h2>Patient Information</h2>
                <table className="info-table">
                    <tbody>
                        <tr>
                            <th>Name</th>
                            <td>{report.patientName}</td>
                        </tr>
                        <tr>
                            <th>Age</th>
                            <td>{report.age}</td>
                        </tr>
                        <tr>
                            <th>Sex</th>
                            <td>{report.sex}</td>
                        </tr>
                        <tr>
                            <th>Phone</th>
                            <td>{report.phone}</td>
                        </tr>
                    </tbody>
                </table>

                {/* Scan Details Table */}
                <h2>Scan Details</h2>
                <table className="info-table">
                    <tbody>
                        <tr>
                            <th>Scan Organ</th>
                            <td>{report.organ}</td>
                        </tr>
                        <tr>
                            <th>Scan Type</th>
                            <td>{report.scanType}</td>
                        </tr>
                        <tr>
                            <th>Image</th>
                            <td>
                                <img 
                                    src={`http://localhost:5000/uploads/${report.imagePath.split('/').pop()}`} 
                                    alt={`Scan of ${report.patientName}`} 
                                    className="report-image" 
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p><strong>Generated On:</strong> {new Date(report.generatedOn).toLocaleString()}</p>
                    <p><strong>Report ID:</strong> {report.id}</p>
                <div className="report-findings">
                    <h2>Report Findings</h2>
                    <p><strong>Outcome:</strong> {report.outcome}</p>
                    
                </div>

                <div className="report-content">
                    
                    <p>{report.content}</p>
                </div>

                {/* Back Button */}
                <a href="/staff/report-history" className="back-button">Back to Report History</a>
            </div>
        </div>
    );
};

export default ReportDetails;
