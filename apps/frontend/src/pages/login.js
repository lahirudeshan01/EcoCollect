import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const { user, signIn } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        signIn(email, password);
    };

    if (user) {
        return <p>Redirecting...</p>;
    }

    return (
        <div style={{ padding: '50px', maxWidth: '400px', margin: 'auto' }}>
            <h2>Resident Login</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="email" 
                    placeholder="Email (e.g., resident@test.com)" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    style={{ display: 'block', margin: '10px 0', padding: '10px', width: '100%' }}
                />
                <input 
                    type="password" 
                    placeholder="Password (e.g., 12345)" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    style={{ display: 'block', margin: '10px 0', padding: '10px', width: '100%' }}
                />
                <button type="submit" style={{ padding: '10px 20px' }}>Log In</button>
            </form>
        </div>
    );
};

export default LoginPage;
