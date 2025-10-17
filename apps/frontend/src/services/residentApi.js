const API_BASE = "http://localhost:5001/api"; // your backend URL

export async function fetchDashboardData() {
  try {
    const res = await fetch(`${API_BASE}/dashboard`); // optional endpoint
    if (!res.ok) throw new Error("Failed to fetch dashboard data");
    return await res.json();
  } catch (err) {
    console.error(err);
    return null; // fallback handled in Dashboard component
  }
}

export async function requestPickup(pickupData) {
  try {
    const res = await fetch(`${API_BASE}/pickups`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pickupData),
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      return { error: errorBody.message || "Failed to schedule pickup" };
    }

    return await res.json(); // backend should return { message, data }
  } catch (err) {
    console.error(err);
    return { error: "Network error. Could not reach backend." };
  }
}
