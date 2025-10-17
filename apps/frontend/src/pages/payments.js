import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { fetchPaymentHistory, addPayment } from "../services/api";

function PaymentHistoryPage() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [residentName, setResidentName] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const [nameOnCard, setNameOnCard] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [billingAddress, setBillingAddress] = useState("");

  const [saving, setSaving] = useState(false);

  // Fetch history
  const loadHistory = async () => {
    try {
      const data = await fetchPaymentHistory();
      setHistory(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching payment history:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const validateForm = () => {
    if (!residentName.trim() || !address.trim() || !date || !amount || Number(amount) <= 0 || !paymentMethod) {
      alert("Please fill in all required fields correctly.");
      return false;
    }
    if (paymentMethod === "card") {
      if (!nameOnCard || !cardNumber || !expiry || !cvc || !billingAddress) {
        alert("Please fill in all card details.");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);

    const payload = {
      residentName,
      address,
      date,
      amount: Number(amount),
      paymentMethod,
      cardDetails:
        paymentMethod === "card"
          ? { nameOnCard, cardNumber, expiry, cvc, billingAddress }
          : null,
    };

    try {
      await addPayment(payload);
      alert("Payment added successfully!");
      // Reset form
      setResidentName("");
      setAddress("");
      setDate("");
      setAmount("");
      setPaymentMethod("");
      setNameOnCard("");
      setCardNumber("");
      setExpiry("");
      setCvc("");
      setBillingAddress("");
      loadHistory(); // refresh list
    } catch (err) {
      console.error(err);
      alert("Failed to add payment");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this payment?")) return;

    try {
      const res = await fetch(`http://localhost:5001/api/payments/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete payment");
      alert("Payment deleted successfully");
      loadHistory();
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to delete payment");
    }
  };

  if (isLoading) return <Layout activeTab="Payment" variant="sidebar"><p className="p-8 text-lg">Loading...</p></Layout>;

  return (
    <Layout activeTab="Payment" variant="sidebar">
      <div className="max-w-3xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-2">Payment & Payback History</h1>
        <p className="text-gray-500 mb-8">Track your charges and recycling credits/paybacks.</p>

        {/* Payment Form */}
        <div className="bg-white rounded-xl shadow p-6 mb-10 border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">Add Payment Details</h2>
          <form className="grid grid-cols-1 sm:grid-cols-2 gap-4" onSubmit={handleSubmit}>
            <div className="sm:col-span-2">
              <label>Resident Name</label>
              <input className="mt-1 w-full border rounded-md px-3 py-2" value={residentName} onChange={e => setResidentName(e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label>Address</label>
              <input className="mt-1 w-full border rounded-md px-3 py-2" value={address} onChange={e => setAddress(e.target.value)} />
            </div>
            <div>
              <label>Date</label>
              <input type="date" className="mt-1 w-full border rounded-md px-3 py-2" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div>
              <label>Amount (Rs)</label>
              <input type="number" className="mt-1 w-full border rounded-md px-3 py-2" value={amount} onChange={e => setAmount(e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label>Payment Method</label>
              <div className="flex gap-6 mt-2">
                <label><input type="radio" value="card" checked={paymentMethod==="card"} onChange={() => setPaymentMethod("card")} /> Card</label>
                <label><input type="radio" value="cash" checked={paymentMethod==="cash"} onChange={() => setPaymentMethod("cash")} /> Cash</label>
              </div>
            </div>

            {paymentMethod === "card" && (
              <>
                <div className="sm:col-span-2 mt-4 pt-4 border-t">Card Details</div>
                <div className="sm:col-span-2"><label>Name on Card</label><input value={nameOnCard} onChange={e => setNameOnCard(e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2" /></div>
                <div className="sm:col-span-2"><label>Card Number</label><input value={cardNumber} onChange={e => setCardNumber(e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2" /></div>
                <div><label>Expiry</label><input value={expiry} onChange={e => setExpiry(e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2" /></div>
                <div><label>CVC</label><input value={cvc} onChange={e => setCvc(e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2" /></div>
                <div className="sm:col-span-2"><label>Billing Address</label><input value={billingAddress} onChange={e => setBillingAddress(e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2" /></div>
              </>
            )}

            <div className="sm:col-span-2 mt-4">
              <button type="submit" disabled={saving} className="px-5 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700">{saving ? "Saving..." : "Submit"}</button>
            </div>
          </form>
        </div>

        {/* Payment History Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {history.length > 0 ? history.map(record => (
            <div key={record._id} className={`rounded-xl shadow-lg p-6 flex flex-col gap-2 ${record.type==="Payback" ? "bg-green-50":"bg-white"}`}>
              <div className="flex items-center justify-between">
                <span>{record.type==="Payback"?"Recycling Credit":record.type}</span>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${record.status==="Paid"?"bg-blue-100 text-blue-700":"bg-yellow-100 text-yellow-700"}`}>{record.status}</span>
                  <button onClick={() => handleDelete(record._id)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs">Delete</button>
                </div>
              </div>
              <div className="text-2xl font-bold">{record.type==="Payback"?`+${record.amount}`:`-${record.amount}`} Rs</div>
              <div className="text-sm text-gray-500">{record.date}</div>
            </div>
          )) : <div className="col-span-2 p-8 text-center text-gray-500 bg-white rounded-xl shadow">No financial records found.</div>}
        </div>
      </div>
    </Layout>
  );
}

export default PaymentHistoryPage;
