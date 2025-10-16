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
    // Simulate API call delay
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (email === 'resident@test.com' && password === '12345') {
                resolve({
                    token: 'mock-token-123',
                    userId: '1',
                    name: 'Resident User'
                });
            } else {
                reject(new Error('Invalid credentials'));
            }
        }, 500);
    });
}
