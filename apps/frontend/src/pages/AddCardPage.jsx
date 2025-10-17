import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';

function AddCardPage() {
  const [name, setName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Card payment submitted successfully.');
    navigate('/payment-history');
  };

  return (
    <Layout activeTab="Add Card" variant="sidebar">
      <div className="max-w-2xl mx-auto p-8 bg-white shadow rounded-xl">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Add Card Details</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name on Card</label>
            <input className="mt-1 w-full border rounded-md px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Card Number</label>
            <input className="mt-1 w-full border rounded-md px-3 py-2" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Expiry</label>
              <input className="mt-1 w-full border rounded-md px-3 py-2" value={expiry} onChange={(e) => setExpiry(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">CVC</label>
              <input className="mt-1 w-full border rounded-md px-3 py-2" value={cvc} onChange={(e) => setCvc(e.target.value)} required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Billing Address</label>
            <input className="mt-1 w-full border rounded-md px-3 py-2" value={billingAddress} onChange={(e) => setBillingAddress(e.target.value)} />
          </div>
          <button type="submit" className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-5 rounded-md">
            Submit
          </button>
        </form>
      </div>
    </Layout>
  );
}

export default AddCardPage;
