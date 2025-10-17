/**
 * Calculate estimated time for a route based on distance and number of collection points
 * @param {string} distanceStr - Distance string (e.g., "10.5 km")
 * @param {number} numPoints - Number of collection points
 * @returns {object} - { timeString: "1h 25m", minutes: 85 }
 */
export const calculateEstimatedTime = (distanceStr, numPoints = 0) => {
  // Extract numeric value from distance string
  const distanceKm = parseFloat(distanceStr.replace(/[^\d.]/g, ''));
  
  if (isNaN(distanceKm)) {
    return { timeString: 'N/A', minutes: 0 };
  }

  // Average speed in urban areas: 20-25 km/h (considering traffic, stops)
  const averageSpeedKmh = 22;
  
  // Time spent at each collection point (in minutes)
  const timePerStopMinutes = 3;
  
  // Calculate driving time
  const drivingTimeMinutes = (distanceKm / averageSpeedKmh) * 60;
  
  // Calculate collection time
  const collectionTimeMinutes = numPoints * timePerStopMinutes;
  
  // Total estimated time
  const totalMinutes = Math.round(drivingTimeMinutes + collectionTimeMinutes);
  
  // Format time string
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  let timeString;
  if (hours > 0) {
    timeString = minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  } else {
    timeString = `${minutes}m`;
  }
  
  return {
    timeString,
    minutes: totalMinutes,
    breakdown: {
      drivingTime: Math.round(drivingTimeMinutes),
      collectionTime: collectionTimeMinutes,
      totalMinutes
    }
  };
};

/**
 * Format minutes into a human-readable time string
 * @param {number} minutes - Total minutes
 * @returns {string} - Formatted time string (e.g., "1h 25m")
 */
export const formatTimeFromMinutes = (minutes) => {
  if (!minutes || minutes <= 0) return 'N/A';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  } else {
    return `${mins}m`;
  }
};
