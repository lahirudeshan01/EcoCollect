import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/context/AuthContext';
// Note: Changed 'react-router-dom' imports to 'next/router' 
// if you are using Next.js (as suggested by file structure).
// Assuming 'react-router-dom' for now, but Next.js is preferred.
import { useNavigate } from 'react-router-dom'; 

const LoginPage = () => {
    const { user, signIn } = useAuth();
    const navigate = useNavigate(); // For React Router
    // If using Next.js, uncomment the lines below and remove 'react-router-dom' imports:
    // import { useRouter } from 'next/router';
    // const router = useRouter(); 

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null); // State for login errors

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        try {
            await signIn(email, password); // Assume signIn is async
        } catch (err) {
            // Handle and display errors from the signIn function
            setError('Login failed. Please check your email and password.'); 
            console.error(err);
        }
    };

    if (user) {
        return <p className="text-center p-10 text-lg">Redirecting to Dashboard...</p>;
    }

    return (
        // Full page container with background and centering
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            {/* Quick navigate arrow to dashboard */}
            <div className="absolute top-4 left-4">
                <button
                    type="button"
                    aria-label="Go to Dashboard"
                    onClick={() => navigate('/dashboard')}
                    className="p-2 rounded-full bg-white border border-gray-200 shadow hover:bg-gray-50"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 5l7 7-7 7" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </div>
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                {/* Logo and App Name */}
                <div className="flex items-center justify-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center shadow-md">
                        <svg className="text-white w-5 h-5" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 12h4l2-3 3 6 3-8 4 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <h2 className="text-center text-2xl font-extrabold text-gray-900">
                        EcoCollect Resident Login
                    </h2>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-100">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        
                        {/* Error Message Display */}
                        {error && (
                            <div className="p-3 bg-red-100 text-red-700 text-sm font-medium rounded-md border border-red-200">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <div className="mt-1">
                                <input 
                                    id="email"
                                    type="email" 
                                    placeholder="resident@test.com"
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    required 
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1">
                                <input 
                                    id="password"
                                    type="password" 
                                    placeholder="12345"
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    required 
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                />
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <button 
                                type="submit" 
                                className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition"
                            >
                                Sign In
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/register')}
                                className="flex-1 flex justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium text-emerald-700 bg-white hover:bg-gray-50 border-emerald-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition"
                            >
                                Sign Up
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;