import React, { useState } from 'react';

// Backend API call function
const requestPickupAPI = async (pickupData) => {
  const response = await fetch('http://localhost:5001/api/pickups', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pickupData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to submit pickup request');
  }

  return response.json();
};

function RequestPickup({ onClose }) {
  const [wasteType, setWasteType] = useState('Bulky');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const pickupData = {
      wasteType,
      date,
      time: time || 'N/A',
      weight,
      notes: notes || '-',
    };

    try {
      const result = await requestPickupAPI(pickupData);
      console.log('Pickup successful:', result);
      alert('✅ Pickup requested successfully!');
      onClose(); // close drawer on success
    } catch (err) {
      console.error('Pickup request failed:', err);
      alert(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={drawerStyles.backdrop}>
      <div style={drawerStyles.drawer}>
        <button
          onClick={onClose}
          aria-label="Close Drawer"
          style={drawerStyles.closeButton}
        >
          ✕
        </button>
        <h3 className="text-xl font-bold mb-4">Schedule Special Pickup</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label style={drawerStyles.label}>Waste Type:</label>
            <select
              value={wasteType}
              onChange={(e) => setWasteType(e.target.value)}
              required
              style={drawerStyles.input}
            >
              <option value="Bulky">Bulky (Sofa, Appliance)</option>
              <option value="Hazardous">Hazardous (Paint, Batteries)</option>
            </select>
          </div>

          <div>
            <label style={drawerStyles.label}>Estimated Weight (kg):</label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
              style={drawerStyles.input}
              placeholder="e.g., 12.5"
            />
          </div>

          <div>
            <label style={drawerStyles.label}>Preferred Date:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              style={drawerStyles.input}
            />
          </div>

          <div>
            <label style={drawerStyles.label}>Preferred Time Slot:</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              style={drawerStyles.input}
              placeholder="Optional"
            />
          </div>

          <div>
            <label style={drawerStyles.label}>Notes for Staff:</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={drawerStyles.input}
              placeholder="Optional notes..."
            />
          </div>

          <button
            type="submit"
            style={{
              ...drawerStyles.submitButton,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Confirm Request'}
          </button>
        </form>
      </div>
    </div>
  );
}

const drawerStyles = {
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 1000,
  },
  drawer: {
    position: 'fixed',
    top: 0,
    right: 0,
    height: '100%',
    width: '400px',
    maxWidth: '100%',
    backgroundColor: 'white',
    padding: '30px',
    overflowY: 'auto',
    boxShadow: '-3px 0 10px rgba(0,0,0,0.2)',
    transform: 'translateX(0)',
    transition: 'transform 0.3s ease-in-out',
    zIndex: 1001,
  },
  closeButton: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '18px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
  },
  submitButton: {
    width: '100%',
    padding: '12px',
    marginTop: '20px',
    backgroundColor: '#059669',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '15px',
  },
};

export default RequestPickup;
