import React, { useState } from 'react';

function RequestPickup({ onClose, onConfirm }) {
    const [wasteType, setWasteType] = useState('Bulky');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [weight, setWeight] = useState('');
    const [notes, setNotes] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm({ wasteType, date, time, weight, notes });
        onClose();
    };

    return (
        <div style={modalStyles.backdrop}>
            <div style={modalStyles.modal}>
                <button
                    onClick={onClose}
                    aria-label="Close Modal"
                    style={modalStyles.closeButton}
                >
                    ✕
                </button>
                <h3>Schedule Special Pickup</h3>
                <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
                    
                    <label style={modalStyles.label}>Waste Type:</label>
                    <select
                        value={wasteType}
                        onChange={(e) => setWasteType(e.target.value)}
                        required
                        style={modalStyles.input}
                    >
                        <option value="Bulky">Bulky (Sofa, Appliance)</option>
                        <option value="Hazardous">Hazardous (Paint, Batteries)</option>
                    </select>

                    <label style={modalStyles.label}>Estimated Weight (kg):</label>
                    <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        required
                        style={modalStyles.input}
                        placeholder="e.g., 12.5"
                    />

                    <label style={modalStyles.label}>Preferred Date:</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        style={modalStyles.input}
                    />

                    <label style={modalStyles.label}>Preferred Time Slot:</label>
                    <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                        style={modalStyles.input}
                    />

                    <label style={modalStyles.label}>Notes for Staff:</label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        style={modalStyles.input}
                        placeholder="Optional notes..."
                    />

                    <button type="submit" style={modalStyles.submitButton}>
                        Confirm Request
                    </button>
                </form>
            </div>
        </div>
    );
}

const modalStyles = {
    backdrop: {
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    },
    modal: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '450px',
        position: 'relative',
    },
    closeButton: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '18px',
    },
    label: {
        display: 'block',
        margin: '15px 0 5px',
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
        marginTop: '25px',
        backgroundColor: '#059669',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '15px',
    },
};


export default RequestPickup;
