// services/api.js

// Backend base URL
const BASE_URL = "http://localhost:5001/api";

// ------------------- Payments -------------------

// Fetch all payment history
export async function fetchPaymentHistory() {
  try {
    const res = await fetch(`${BASE_URL}/payments`);
    if (!res.ok) {
      throw new Error("Failed to fetch payment history");
    }
    return await res.json();
  } catch (error) {
    console.error("fetchPaymentHistory error:", error);
    throw error;
  }
}

// Add a new payment
export async function addPayment(paymentData) {
  try {
    const res = await fetch(`${BASE_URL}/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentData),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to add payment");
    }

    return await res.json();
  } catch (error) {
    console.error("addPayment error:", error);
    throw error;
  }
}

// ------------------- Waste History -------------------

export async function fetchWasteHistory() {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/users/history`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error("Failed to fetch waste history");
    return await res.json();
  } catch (error) {
    console.error("fetchWasteHistory error:", error);
    throw error;
  }
}

// ------------------- Authentication -------------------

export async function login(email, password) {
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Login failed");
    }

    const data = await res.json();
    return {
      token: data.token,
      userId: data.user?.id,
      name: data.user?.name || "Resident",
    };
  } catch (error) {
    console.error("login error:", error);
    throw error;
  }
}

export async function register(name, email, password) {
  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Registration failed");
    }

    return await res.json();
  } catch (error) {
    console.error("register error:", error);
    throw error;
  }
}

// Request a new pickup
export async function requestPickup(pickupData) {
  const res = await fetch('http://localhost:5001/api/pickups', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pickupData),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    return { error: errorData.message || 'Failed to request pickup' };
  }

  return await res.json(); // returns the saved pickup with _id
}

// Fetch dashboard data (all pickups)
export async function fetchDashboardData() {
  const res = await fetch('http://localhost:5001/api/pickups');
  if (!res.ok) throw new Error('Failed to fetch pickups');
  return await res.json();
}
