// Dummy service for dashboard data and pickup request
export async function fetchDashboardData() {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ totalWaste: 12482 });
    }, 500);
  });
}

export async function requestPickup(formData) {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({}); // No suggestion or payment required
    }, 500);
  });
}
