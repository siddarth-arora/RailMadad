// Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import { useAuth } from '../context/AuthContext'; // Update the path accordingly

function Login() {
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();
    const { login } = useAuth(); // Destructure login function from context

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;
        if (!email || !password) {
            return handleError('Email and password are required');
        }
        try {
            const url = "http://localhost:8080/auth/login";
            const response = await fetch(url, {
                method: "PUT", // Changed to POST for login
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginInfo)
            });
            const result = await response.json();
            const { success, message, jwtToken, name, error } = result;

            if (success) {
                handleSuccess(message);
                localStorage.setItem('token', jwtToken);
                localStorage.setItem('loggedInUser', name);
                login(); // Set authentication state to true
                localStorage.setItem('refreshPage', 'true'); // Set flag to trigger refresh
                setTimeout(() => {
                    // Check if the email is for admin and navigate accordingly
                    if (email === 'admin@gmail.com') {
                        navigate('/result');
                    } else {
                        navigate('/home');
                    }
                }, 1000);
            } else if (error) {
                const details = error?.details[0].message;
                handleError(details);
            } else {
                handleError(message);
            }
        } catch (err) {
            handleError('An error occurred during login.');
        }
    };

    return (
        <div className='container'>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor='email'>Email</label>
                    <input
                        onChange={handleChange}
                        type='email'
                        name='email'
                        placeholder='Enter your email...'
                        value={loginInfo.email}
                        required
                    />
                </div>
                <div>
                    <label htmlFor='password'>Password</label>
                    <input
                        onChange={handleChange}
                        type='password'
                        name='password'
                        placeholder='Enter your password...'
                        value={loginInfo.password}
                        required
                    />
                </div>
                <button type='submit'>Login</button>
                <span>Doesn't have an account? <Link to="/signup">Signup</Link></span>
            </form>
            <ToastContainer />
        </div>
    );
}

export default Login;