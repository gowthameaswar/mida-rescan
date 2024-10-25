import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PDFDocument, rgb } from 'pdf-lib'; // Import pdf-lib
import './Report.css';
import Header from './Header'; // Import the Header component

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

    const handleDownloadPDF = async () => {
        // Fetch the template PDF
        const templateBytes = await fetch('http://localhost:5000/api/template-pdf').then(res => res.arrayBuffer());
        const pdfDoc = await PDFDocument.load(templateBytes);
        const page = pdfDoc.getPage(0);
        
        // Starting Y position after header
        let yPosition = page.getHeight() - 150;
    
        // Title
        page.drawText('Report Details', {
            x: 50,
            y: yPosition,
            size: 18,
            color: rgb(0, 0, 0),
        });
        yPosition -= 30;
    
        // Draw Patient Information Table
        page.drawText('Patient Information', { x: 50, y: yPosition, size: 14 });
        yPosition -= 20;
        
        // Draw Table Borders
        const tableX = 50;
        const tableWidth = 500;
        const rowHeight = 20;
        
        const patientInfo = [
            ['Name', report.patientName],
            ['Age', report.age],
            ['Sex', report.sex],
            ['Phone', report.phone]
        ];
        
        patientInfo.forEach((row, rowIndex) => {
            const rowY = yPosition - (rowIndex * rowHeight);
            page.drawLine({
                start: { x: tableX, y: rowY },
                end: { x: tableX + tableWidth, y: rowY },
                thickness: 1,
                color: rgb(0, 0, 0),
            });
            page.drawText(row[0], { x: tableX + 5, y: rowY - 15, size: 12 });
            page.drawText(row[1], { x: tableX + 150, y: rowY - 15, size: 12 });
        });
    
        // Last row border for the table
        page.drawLine({
            start: { x: tableX, y: yPosition - patientInfo.length * rowHeight },
            end: { x: tableX + tableWidth, y: yPosition - patientInfo.length * rowHeight },
            thickness: 1,
            color: rgb(0, 0, 0),
        });
        yPosition -= (patientInfo.length * rowHeight + 30);
    
        // Draw Scan Details Table
        page.drawText('Scan Details', { x: 50, y: yPosition, size: 14 });
        yPosition -= 20;
    
        const scanDetails = [
            ['Scan Organ', report.organ],
            ['Scan Type', report.scanType],
        ];
    
        scanDetails.forEach((row, rowIndex) => {
            const rowY = yPosition - (rowIndex * rowHeight);
            page.drawLine({
                start: { x: tableX, y: rowY },
                end: { x: tableX + tableWidth, y: rowY },
                thickness: 1,
                color: rgb(0, 0, 0),
            });
            page.drawText(row[0], { x: tableX + 5, y: rowY - 15, size: 12 });
            page.drawText(row[1], { x: tableX + 150, y: rowY - 15, size: 12 });
        });
        page.drawLine({
            start: { x: tableX, y: yPosition - scanDetails.length * rowHeight },
            end: { x: tableX + tableWidth, y: yPosition - scanDetails.length * rowHeight },
            thickness: 1,
            color: rgb(0, 0, 0),
        });
        yPosition -= (scanDetails.length * rowHeight + 30);
    
        // Embed and draw the scan image
        const imageUrl = `http://localhost:5000/uploads/${report.imagePath.split('/').pop()}`;
        const imageBytes = await fetch(imageUrl).then(res => res.arrayBuffer());
        const jpegImage = await pdfDoc.embedJpg(imageBytes);
        const boxWidth = 130, boxHeight = 100;
        page.drawImage(jpegImage, { x: 50, y: yPosition - boxHeight, width: boxWidth, height: boxHeight });
        yPosition -= (boxHeight + 20);
    
        // Additional text like findings, etc.
        page.drawText(`Generated On: ${new Date(report.generatedOn).toLocaleString()}`, { x: 50, y: yPosition, size: 12 });
        yPosition -= 20;
        page.drawText('Report Findings:', { x: 50, y: yPosition, size: 14 });
        yPosition -= 20;
        page.drawText(report.outcome, { x: 50, y: yPosition, size: 12 });
        
        // Draw Report Content
        yPosition -= 25; // Move down for the content
        page.drawText('Report Content:', {
            x: 50,
            y: yPosition,
            size: 14,
            color: rgb(0, 0, 0),
        });
        yPosition -= 15; // Move down for the content
        page.drawText(report.content, {
            x: 50,
            y: yPosition,
            size: 12,
            color: rgb(0, 0, 0),
            maxWidth: page.getWidth() - 100, // Limit the width of the text
        });
    
        // Save the PDF
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
    
        // Sanitize patient name for filename
        const sanitizedPatientName = report.patientName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const filename = `${sanitizedPatientName}_report.pdf`; // Set filename
    
        const a = document.createElement('a');
        a.href = url;
        a.download = filename; // Use sanitized patient name in filename
        a.click();
        URL.revokeObjectURL(url);
    };
    
    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            {/* Add the Header component */}
            <Header />

            <div className="report-details-container" id="pdf-content">
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
                                    style={{ maxWidth: '100%', height: 'auto' }}
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
            </div>

            {/* Button Section */}
            <div className="button-section">
                <button onClick={handleDownloadPDF} className="download-button">Download PDF</button>
                <a href="/staff/report-history" className="back-button">Back to Report History</a>
            </div>

        </div>
    );
};

export default ReportDetails;
