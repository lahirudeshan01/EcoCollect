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
  const [amount, setAmount] = useState(""); // NEW: Amount field
  const [paymentMethod, setPaymentMethod] = useState(""); // "card" or "cash"

  const [nameOnCard, setNameOnCard] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [billingAddress, setBillingAddress] = useState("");

  const [saving, setSaving] = useState(false);

  // Fetch history from backend
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
    if (!residentName.trim()) {
      alert("Resident Name is required");
      return false;
    }
    if (!address.trim()) {
      alert("Address is required");
      return false;
    }
    if (!date) {
      alert("Date is required");
      return false;
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert("Amount must be a positive number");
      return false;
    }
    if (!paymentMethod) {
      alert("Please select a Payment Method");
      return false;
    }
    if (paymentMethod === "card") {
      if (!nameOnCard.trim()) {
        alert("Name on Card is required");
        return false;
      }
      if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ""))) {
        alert("Card Number must be 16 digits");
        return false;
      }
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
        alert("Expiry must be in MM/YY format");
        return false;
      }
      if (!/^\d{3,4}$/.test(cvc)) {
        alert("CVC must be 3 or 4 digits");
        return false;
      }
      if (!billingAddress.trim()) {
        alert("Billing Address is required");
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
      await addPayment(payload); // POST to backend
      alert("Payment submitted successfully!");
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

      // Refresh history list
      loadHistory();
    } catch (error) {
      console.error("Error adding payment:", error);
      alert(error.message || "Failed to add payment");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading)
    return (
      <Layout activeTab="Payment" variant="sidebar">
        <p className="p-8 text-lg">Loading Payment History...</p>
      </Layout>
    );

  return (
    <Layout activeTab="Payment" variant="sidebar">
      <div className="max-w-3xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">
          Payment & Payback History
        </h1>
        <p className="text-gray-500 mb-8">
          Track your charges and recycling credits/paybacks.
        </p>

        {/* Payment Form */}
        <div className="bg-white rounded-xl shadow p-6 mb-10 border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Add Payment Details
          </h2>
          <form className="grid grid-cols-1 sm:grid-cols-2 gap-4" onSubmit={handleSubmit}>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Resident Name</label>
              <input
                className="mt-1 w-full border rounded-md px-3 py-2"
                value={residentName}
                onChange={(e) => setResidentName(e.target.value)}
                placeholder="John Doe"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                className="mt-1 w-full border rounded-md px-3 py-2"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main St, City"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                className="mt-1 w-full border rounded-md px-3 py-2"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Amount (USD)</label>
              <input
                type="number"
                className="mt-1 w-full border rounded-md px-3 py-2"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Payment Method</label>
              <div className="flex gap-6 mt-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                  />
                  Card Payment
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={() => setPaymentMethod("cash")}
                  />
                  Cash Payment
                </label>
              </div>
            </div>

            {/* Card Details */}
            {paymentMethod === "card" && (
              <>
                <div className="sm:col-span-2 border-t mt-4 pt-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Card Details</h3>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Name on Card</label>
                  <input
                    className="mt-1 w-full border rounded-md px-3 py-2"
                    value={nameOnCard}
                    onChange={(e) => setNameOnCard(e.target.value)}
                    placeholder="Resident User"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Card Number</label>
                  <input
                    className="mt-1 w-full border rounded-md px-3 py-2"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4242 4242 4242 4242"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Expiry</label>
                  <input
                    className="mt-1 w-full border rounded-md px-3 py-2"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">CVC</label>
                  <input
                    className="mt-1 w-full border rounded-md px-3 py-2"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    placeholder="123"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Billing Address</label>
                  <input
                    className="mt-1 w-full border rounded-md px-3 py-2"
                    value={billingAddress}
                    onChange={(e) => setBillingAddress(e.target.value)}
                    placeholder="123 Main St, City"
                  />
                </div>
              </>
            )}

            <div className="sm:col-span-2 mt-4">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-md text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Submit"}
              </button>
            </div>
          </form>
        </div>

        {/* Payment History Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          {history.length > 0 ? (
            history.map((record, idx) => (
              <div
                key={idx}
                className={`rounded-xl shadow-lg p-6 flex flex-col gap-2 ${
                  record.type === "Payback" ? "bg-green-50" : "bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-700">
                    {record.type === "Payback" ? "Recycling Credit" : record.type}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      record.status === "Paid"
                        ? "bg-blue-100 text-blue-700"
                        : record.status === "Credited"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {record.status}
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {record.type === "Payback"
                    ? `+${record.amount.toFixed(2)}`
                    : `-${record.amount.toFixed(2)}`}{" "}
                  <span className="text-base font-normal text-gray-600">Rs</span>
                </div>
                <div className="text-sm text-gray-500">{record.date}</div>
              </div>
            ))
          ) : (
            <div className="col-span-2 p-8 text-center text-gray-500 bg-white rounded-xl shadow">
              No financial records found.
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default PaymentHistoryPage;
