import React, { useState } from 'react';
import { register as apiRegister, login as apiLogin } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await apiRegister(name, email, password);
            try {
                // Auto-login after register for smoother UX
                const loginData = await apiLogin(email, password);
                localStorage.setItem('token', loginData.token);
                localStorage.setItem('userId', loginData.userId);
                localStorage.setItem('name', loginData.name || 'Resident');
                navigate('/dashboard');
            } catch (loginErr) {
                setError(loginErr.message || 'Registered, but login failed. Please try signing in.');
            }
        } catch (err) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
            </div>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="p-3 bg-red-100 text-red-700 text-sm font-medium rounded-md border border-red-200">{error}</div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input className="mt-1 w-full border rounded-md px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="Resident User" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email address</label>
                            <input className="mt-1 w-full border rounded-md px-3 py-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input className="mt-1 w-full border rounded-md px-3 py-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="********" required />
                        </div>
                        <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 rounded-md text-white bg-emerald-600 hover:bg-emerald-700">
                            {loading ? 'Creating...' : 'Create account'}
                        </button>
                        <div className="text-sm text-center">
                            Already have an account? <a href="/login" className="text-emerald-600 font-medium">Sign in</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}


