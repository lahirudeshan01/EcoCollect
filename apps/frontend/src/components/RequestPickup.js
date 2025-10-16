import React from 'react';

const RequestPickup = ({ onClose, onConfirm }) => {
  // Add your pickup request form here
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Request a Pickup</h2>
        {/* Add form fields for pickup request */}
        <button onClick={onConfirm}>Confirm</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default RequestPickup;
