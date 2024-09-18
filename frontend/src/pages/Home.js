import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
// import trainLogo from './path-to-your-train-logo.png';
import "./homepage.css";

function Home() {
    useEffect(() => {
        // Check if the refresh flag is set
        if (localStorage.getItem('refreshPage') === 'true') {
          // Refresh the page
          localStorage.removeItem('refreshPage'); // Clear the flag
          window.location.reload();
        }
      }, []);
    const [loggedInUser, setLoggedInUser] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem('loggedInUser');
        if (user) {
            setLoggedInUser(user);
        } else {
            navigate('/login'); // Redirect to login if no user is logged in
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('User Logged out');
        navigate('/login'); // Redirect to login page
    };

    const fetchProducts = async () => {
        setLoading(true); // Start loading
        try {
            const url = "https://deploy-mern-app-1-api.vercel.app/products";
            const headers = {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            };
            const response = await fetch(url, headers);
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const result = await response.json();
            setProducts(result);  // Assuming result is an array of products
        } catch (err) {
            setError('Failed to load products');
            handleError(err);
        } finally {
            setLoading(false); // End loading
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className="homepage-container">
        <header className="homepage-header">
            <h1>Welcome, {loggedInUser}</h1>
            {/* <img src={trainLogo} alt="Train Logo" className="train-logo" /> */}
        </header>
        <section className="info-section">
            <h2>Latest Train Information</h2>
            <ul>
                <li><strong>Train Number:</strong> 12345</li>
                <li><strong>Departure Time:</strong> 10:00 AM</li>
                <li><strong>Arrival Time:</strong> 02:00 PM</li>
                <li><strong>Status:</strong> On Time</li>
            </ul>
        </section>
        <ToastContainer />
    </div>
    );
}

export default Home;
