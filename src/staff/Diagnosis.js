import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Import the uuid function
import Header from './Header';
import './Diagnosis.css';

const Diagnosis = () => {
    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [result, setResult] = useState(null);
    const [detailsSaved, setDetailsSaved] = useState(false);

    const [patientName, setPatientName] = useState('');
    const [age, setAge] = useState('');
    const [phone, setPhone] = useState('');
    const [sex, setSex] = useState('Select sex');
    const [organ, setOrgan] = useState('Select organ');
    const [scanType, setScanType] = useState('Select scan type');

    const handleFileChange = (e) => {
        const uploadedFile = e.target.files[0];
        setFile(uploadedFile);

        if (uploadedFile) {
            const fileURL = URL.createObjectURL(uploadedFile);
            setImagePreview(fileURL);
        }
    };

    const validatePhoneNumber = (phone) => {
        const phonePattern = /^[0-9]{10}$/; // Matches exactly 10 digits
        return phonePattern.test(phone);
    };

    const handleAnalyze = async () => {
        if (!file || organ === 'Select organ' || scanType === 'Select scan type') {
            alert('Please fill in all the fields.');
            return;
        }

        if (!validatePhoneNumber(phone)) {
            alert('Please enter a valid phone number (10 digits).');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);
        formData.append('organ', organ);
        formData.append('scanType', scanType);
        formData.append('patientName', patientName);
        formData.append('age', age);
        formData.append('phone', phone);
        formData.append('sex', sex);

        try {
            const response = await fetch('http://localhost:5000/api/diagnosis', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setResult(data.result);
                setDetailsSaved(false); // Reset detailsSaved

                // Generate a UUID for the report
                const reportId = uuidv4();
                const content = data.content;

                // Fetch online user ID
                const userResponse = await fetch('http://localhost:5000/api/online-user');
                const userData = await userResponse.json();

                if (userResponse.ok) {
                    const fileName = file.name; // Capture the file name from the uploaded file
                    const imagePath = `/uploads/${fileName}`; // Format the image path

                    const reportData = {
                        id: reportId, // Include the generated UUID
                        patientName,
                        age,
                        sex,
                        phone,
                        staffId: userData.id, // Use the fetched online user ID
                        outcome: data.result,
                        imagePath, // Store the image path in the specified format
                        organ,                    // Store the selected organ
                        scanType,  
                        content,
                        generatedOn: new Date().toISOString() // Store the current timestamp
                    };

                    const reportResponse = await fetch('http://localhost:5000/api/reports', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(reportData),
                    });

                    if (reportResponse.ok) {
                        setDetailsSaved(true); // Set detailsSaved to true when details are saved
                    } else {
                        setDetailsSaved(false);
                    }
                } else {
                    setResult(`Error fetching user ID: ${userData.error}`);
                }
            } else {
                setResult(`Error: ${data.error}`);
            }
        } catch (error) {
            setResult('An error occurred.');
        }
    };

    const handleOrganChange = (e) => {
        setOrgan(e.target.value);
        setScanType('Select scan type'); // Reset scan type when organ changes
    };

    return (
        <div>
            <div className="diagnosis-page">
                <Header />
                <div className="diagnosis-container">
                    <h1>Diagnosis</h1>
                    <div className="form-box">
                        <div className="input-section">
                            <input
                                type="text"
                                placeholder="Patient Name"
                                value={patientName}
                                onChange={(e) => setPatientName(e.target.value)}
                                className="input-field"
                            />
                            <input
                                type="number"
                                placeholder="Age"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                className="input-field"
                            />
                            <input
                                type="tel"
                                placeholder="Phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="input-field"
                            />
                            <select value={sex} onChange={(e) => setSex(e.target.value)} className="dropdown-select">
                                <option disabled>Select sex</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                            <select value={organ} onChange={handleOrganChange} className="dropdown-select">
                                <option disabled>Select organ</option>
                                <option value="Brain">Brain</option>
                                <option value="Chest">Chest</option>
                            </select>
                            <select
                                value={scanType}
                                onChange={(e) => setScanType(e.target.value)}
                                className="dropdown-select"
                            >
                                <option disabled>Select scan type</option>
                                <option value="CT">CT</option>
                                <option value="MRI" disabled={organ === 'Chest'}>MRI</option>
                                <option value="X-ray" disabled={organ === 'Brain'}>X-ray</option>
                            </select>
                        </div>

                        <div className="upload-section">
                            <div className="upload-bar">
                                <input type="file" id="file-upload" onChange={handleFileChange} />
                                <label htmlFor="file-upload" className="upload-label">
                                    {file ? file.name : 'Choose a file'}
                                </label>
                            </div>
                        </div>

                        <button onClick={handleAnalyze} className="analyze-button">
                            Submit
                        </button>
                    </div>

                    {imagePreview && (
                        <div className="image-preview">
                            <h2>Image Preview:</h2>
                            <img src={imagePreview} alt="Uploaded" />
                        </div>
                    )}

                    {result && (
                        <div className="result-section">
                            <h2>Result:</h2>
                            <p>{result}</p>
                        </div>
                    )}

                    {detailsSaved && (
                        <div className="success-message">
                            <p>Details saved</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Diagnosis;
