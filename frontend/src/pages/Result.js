import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { handleError } from '../utils';
import './Result.css'; // Include the CSS for styling

function Result() {
    useEffect(() => {
        // Check if the refresh flag is set
        if (localStorage.getItem('refreshPage') === 'true') {
          // Refresh the page
          localStorage.removeItem('refreshPage'); // Clear the flag
          window.location.reload();
        }
      }, []);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchComplaints = async () => {
        try {
            const url = 'http://localhost:8080/auth/complaints';
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch complaints');
            }

            const result = await response.json();
            setComplaints(result.complaints || []);
            setLoading(false);
            // handleSuccess('Complaints fetched successfully');
        } catch (err) {
            setError(err.message);
            setLoading(false);
            handleError(err.message);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    return (
        <div className="result-container">
            <h1>Complaints</h1>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : complaints.length > 0 ? (
                <table className="complaints-table">
                    <thead>
                        <tr>
                            <th>Serial</th>
                            <th>Type of Complaint</th>
                            <th>Description</th>
                            <th>Train Number</th>
                            <th>Ticket Number</th>
                            <th>Inquiry Date</th>
                            <th>Priority</th>
                        </tr>
                    </thead>
                    <tbody>
                        {complaints.map((complaint, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{complaint.typeOfComplaint}</td>
                                <td>{complaint.description}</td>
                                <td>{complaint.trainNumber}</td>
                                <td>{complaint.ticketNumber}</td>
                                <td>{new Date(complaint.inquiryDate).toLocaleDateString()}</td>
                                <td>{complaint.priority !== null ? complaint.priority : 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No complaints found</p>
            )}
            <ToastContainer />
        </div>
    );
}

export default Result;