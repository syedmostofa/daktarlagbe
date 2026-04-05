import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { createPaymentApi } from '../api/paymentsApi';
import toast from 'react-hot-toast';
import { Banknote, CreditCard, Smartphone } from 'lucide-react';

const METHODS = [
  { id: 'bkash', label: 'bKash', icon: Smartphone, color: 'bg-pink-50 border-pink-200 text-pink-700', activeRing: 'ring-pink-300' },
  { id: 'nagad', label: 'Nagad', icon: Smartphone, color: 'bg-orange-50 border-orange-200 text-orange-700', activeRing: 'ring-orange-300' },
  { id: 'card', label: 'Card', icon: CreditCard, color: 'bg-blue-50 border-blue-200 text-blue-700', activeRing: 'ring-blue-300' },
  { id: 'cash', label: 'Cash', icon: Banknote, color: 'bg-green-50 border-green-200 text-green-700', activeRing: 'ring-green-300' },
];

export default function PaymentPage() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state ?? {};

  const [method, setMethod] = useState('bkash');
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await createPaymentApi({ appointment_id: appointmentId, method });
      const payment = res.data.payment;
      if (payment.status === 'completed') {
        toast.success('Payment successful!');
      } else {
        toast.success('Payment recorded. Please pay cash at the chamber.');
      }
      navigate('/my-appointments');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Payment failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Payment</h1>
        <p className="text-gray-500 mt-1.5">Complete payment for your appointment.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-7">
        {/* Fee display */}
        <div className="text-center py-6 bg-gradient-to-br from-teal-50 to-teal-100/50 rounded-2xl border border-teal-100">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest mb-2">Amount Due</p>
          <p className="text-5xl font-extrabold text-gray-900 tracking-tight">৳{state.fee || '—'}</p>
          {state.doctorName && (
            <p className="text-sm text-gray-500 mt-2 font-medium">Dr. {state.doctorName}</p>
          )}
        </div>

        {/* Method selection */}
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-3">Choose Payment Method</label>
          <div className="grid grid-cols-2 gap-3">
            {METHODS.map((m) => {
              const Icon = m.icon;
              const isActive = method === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m.id)}
                  className={`flex items-center gap-2.5 px-4 py-3.5 rounded-xl border text-sm font-semibold transition-all ${
                    isActive
                      ? `${m.color} ring-2 ${m.activeRing}`
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={18} />
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

        {method !== 'cash' && (
          <p className="text-xs text-gray-400 text-center bg-gray-50 rounded-xl px-4 py-3">
            This is a simulated payment — no real transaction will occur.
          </p>
        )}

        <button
          onClick={handlePay}
          disabled={loading}
          className="w-full bg-teal-600 text-white py-4 rounded-2xl font-bold text-base hover:bg-teal-700 transition-colors disabled:opacity-50 shadow-md shadow-teal-200"
        >
          {loading ? 'Processing…' : method === 'cash' ? 'Confirm Cash Payment' : `Pay ৳${state.fee || '—'}`}
        </button>
      </div>
    </div>
  );
}
