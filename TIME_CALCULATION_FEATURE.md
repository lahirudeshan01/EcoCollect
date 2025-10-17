# Time Calculation Feature - Implementation Guide

## Overview
Implemented automatic time calculation for waste collection routes based on distance and number of collection points.

## How It Works

### Calculation Formula
```
Total Time = Driving Time + Collection Time

Where:
- Driving Time = (Distance in km / Average Speed) * 60 minutes
- Average Speed = 22 km/h (urban waste collection with traffic)
- Collection Time = Number of Points × 3 minutes per stop
```

### Time Calculation Parameters

1. **Average Speed**: 22 km/h
   - Accounts for urban traffic conditions
   - Includes time for turns and navigation
   - Realistic for waste collection vehicles

2. **Collection Time**: 3 minutes per stop
   - Time to stop the vehicle
   - Collect waste from the location
   - Resume route

3. **Distance**: Extracted from route calculation
   - Uses road route distance when available
   - Falls back to direct route distance

## Implementation Details

### Backend Changes

#### 1. Route Model (`apps/backend/src/features/routes/model.js`)
Added new fields:
```javascript
estimatedTime: {
  type: String,
  default: null
},
estimatedTimeMinutes: {
  type: Number,
  default: null
}
```

#### 2. Route Controller (`apps/backend/src/features/routes/controller.js`)
Added `calculateEstimatedTime()` function:
```javascript
const calculateEstimatedTime = (distanceStr, numPoints = 0) => {
  const distanceKm = parseFloat(distanceStr.replace(/[^\d.]/g, ''));
  const averageSpeedKmh = 22;
  const timePerStopMinutes = 3;
  
  const drivingTimeMinutes = (distanceKm / averageSpeedKmh) * 60;
  const collectionTimeMinutes = numPoints * timePerStopMinutes;
  const totalMinutes = Math.round(drivingTimeMinutes + collectionTimeMinutes);
  
  // Returns formatted time string and numeric value
  return { timeString, minutes: totalMinutes };
};
```

Automatically calculates time when creating routes:
```javascript
const timeEstimate = calculateEstimatedTime(distance, numPoints);
const newRoute = new Route({
  // ... other fields
  estimatedTime: timeEstimate.timeString,
  estimatedTimeMinutes: timeEstimate.minutes,
});
```

### Frontend Changes

#### 1. Utility Function (`apps/frontend/src/utils/timeCalculator.js`)
Created reusable time calculation utility:
- `calculateEstimatedTime()` - Calculate time from distance and points
- `formatTimeFromMinutes()` - Format minutes to readable string

#### 2. Route Details Page (`apps/frontend/src/pages/RouteDetailsPage.js`)
- Displays estimated time in info card
- Added time breakdown section showing:
  - Number of collection points
  - Total distance
  - Estimated duration with calculation details

#### 3. Route Optimization Page (`apps/frontend/src/pages/RouteOptimizationPage.jsx`)
- Added "Est. Time" column to route table
- Shows calculated time for each route

## Example Calculations

### Example 1: Short Urban Route
- **Distance**: 5.2 km
- **Collection Points**: 8 stops
- **Calculation**:
  - Driving time: (5.2 / 22) × 60 = 14 minutes
  - Collection time: 8 × 3 = 24 minutes
  - **Total**: 38 minutes

### Example 2: Medium Route
- **Distance**: 12.5 km
- **Collection Points**: 15 stops
- **Calculation**:
  - Driving time: (12.5 / 22) × 60 = 34 minutes
  - Collection time: 15 × 3 = 45 minutes
  - **Total**: 1h 19m (79 minutes)

### Example 3: Long Route
- **Distance**: 25.0 km
- **Collection Points**: 20 stops
- **Calculation**:
  - Driving time: (25.0 / 22) × 60 = 68 minutes
  - Collection time: 20 × 3 = 60 minutes
  - **Total**: 2h 8m (128 minutes)

## Features

### ✅ Automatic Calculation
- Time is automatically calculated when routes are created
- No manual input required
- Stored in database for consistency

### ✅ Real-time Display
- Shows in route details page
- Visible in route optimization table
- Includes breakdown of calculation

### ✅ Accurate Estimates
- Based on realistic urban driving speeds
- Accounts for collection stops
- Considers number of waypoints

### ✅ User-Friendly Format
- Displays as "1h 25m" or "45m"
- Easy to read and understand
- Consistent formatting throughout

## Testing

### Test New Routes
1. Create a new route with multiple collection points
2. Check that estimated time appears in the table
3. Click on route to view details
4. Verify time breakdown shows correctly

### Test Existing Routes
- Routes created before this feature will show "N/A"
- Delete and recreate routes to get time calculations
- Or manually update routes in database

## Files Modified

1. ✅ `apps/backend/src/features/routes/model.js` - Added time fields
2. ✅ `apps/backend/src/features/routes/controller.js` - Added calculation logic
3. ✅ `apps/frontend/src/pages/RouteDetailsPage.js` - Display time and breakdown
4. ✅ `apps/frontend/src/pages/RouteOptimizationPage.jsx` - Added time column
5. ✅ `apps/frontend/src/utils/timeCalculator.js` - Created utility functions

## Future Enhancements

### Possible Improvements:
1. **Dynamic Speed Adjustment**
   - Different speeds for different areas
   - Time-of-day traffic considerations
   - Weather conditions impact

2. **Variable Collection Times**
   - Different times based on waste type
   - Residential vs commercial collection
   - Container size considerations

3. **Real-time Updates**
   - Track actual completion time
   - Compare estimated vs actual
   - Improve predictions over time

4. **Route Optimization**
   - Optimize based on time constraints
   - Balance route times across fleet
   - Consider driver shift schedules

## Configuration

To adjust calculation parameters, edit the constants in:
- Backend: `apps/backend/src/features/routes/controller.js`
- Frontend: `apps/frontend/src/utils/timeCalculator.js`

```javascript
const averageSpeedKmh = 22;        // Adjust driving speed
const timePerStopMinutes = 3;      // Adjust collection time
```

---

**Last Updated**: October 17, 2025
**Status**: ✅ Implemented and Working
