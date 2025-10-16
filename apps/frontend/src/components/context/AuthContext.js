import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const name = localStorage.getItem('name');
        if (token && userId) {
            setUser({ id: userId, name: name || 'Resident' });
        }
    }, []);

    const signIn = async (email, password) => {
        try {
            const data = await apiLogin(email, password);
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('name', data.name || 'Resident');
            setUser({ id: data.userId, name: data.name || 'Resident' });
            navigate('/dashboard');
        } catch (error) {
            console.error('Login failed:', error);
            alert('Invalid email or password.');
        }
    };

    const signOut = () => {
        localStorage.clear();
        setUser(null);
        navigate('/');
    };

    return (
        <AuthContext.Provider value={{ user, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
