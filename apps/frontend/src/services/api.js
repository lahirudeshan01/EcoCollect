// Mock fetchPaymentHistory function for payments page
export async function fetchPaymentHistory() {
    // Simulate API call delay and return mock data
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { date: '2025-10-01', type: 'Charge', amount: 15.00, status: 'Paid' },
                { date: '2025-10-08', type: 'Payback', amount: 5.00, status: 'Credited' },
                { date: '2025-10-15', type: 'Charge', amount: 20.00, status: 'Pending' }
            ]);
        }, 500);
    });
}
// Real fetchWasteHistory function for history page
export async function fetchWasteHistory() {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/users/history', {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    if (!res.ok) throw new Error('Failed to fetch waste history');
    return await res.json();
}
// Mock login function for authentication
export async function login(email, password) {
    const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Login failed');
    }
    const data = await res.json();
    // Backend returns { token, user: { id, name, email, role } }
    return {
        token: data.token,
        userId: data.user?.id,
        name: data.user?.name || 'Resident'
    };
}

export async function register(name, email, password) {
    const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Registration failed');
    }
    return await res.json();
}
