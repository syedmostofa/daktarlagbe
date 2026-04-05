import { useState } from 'react';
import { useParams, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { createAppointmentApi } from '../api/appointmentsApi';
import { useAuth } from '../context/AuthContext';
import { format, parseISO } from 'date-fns';
import toast from 'react-hot-toast';
import { CalendarDays, Clock, User, Banknote } from 'lucide-react';

function formatTime(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
}

export default function BookAppointment() {
  const { doctorId, slotId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const state = location.state ?? {};
  const { date, slotTime, slotEndTime, doctorName, specialty, fee } = state;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await createAppointmentApi({ slot_id: slotId, notes });
      toast.success('Appointment booked successfully!');
      navigate('/my-appointments');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Confirm Appointment</h1>
        <p className="text-gray-500 mt-1.5">Review your booking details before confirming.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-6">
        {/* Summary */}
        <div className="space-y-5">
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="bg-teal-100 text-teal-600 rounded-xl p-2.5 flex-shrink-0">
              <User size={18} />
            </div>
            <div>
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wide block mb-0.5">Doctor</span>
              <span className="font-bold text-gray-900">Dr. {doctorName ?? '—'}</span>
              {specialty && <span className="text-teal-600 ml-2 text-sm font-medium">{specialty}</span>}
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="bg-teal-100 text-teal-600 rounded-xl p-2.5 flex-shrink-0">
              <CalendarDays size={18} />
            </div>
            <div>
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wide block mb-0.5">Date</span>
              <span className="font-bold text-gray-900">
                {date ? format(parseISO(date), 'EEEE, dd MMMM yyyy') : '—'}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="bg-teal-100 text-teal-600 rounded-xl p-2.5 flex-shrink-0">
              <Clock size={18} />
            </div>
            <div>
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wide block mb-0.5">Time</span>
              <span className="font-bold text-gray-900">
                {slotTime ? `${formatTime(slotTime)}${slotEndTime ? ` – ${formatTime(slotEndTime)}` : ''}` : '—'}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-teal-50 rounded-xl border border-teal-100">
            <div className="bg-teal-100 text-teal-600 rounded-xl p-2.5 flex-shrink-0">
              <Banknote size={18} />
            </div>
            <div>
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wide block mb-0.5">Consultation Fee</span>
              <span className="text-2xl font-extrabold text-gray-900 tracking-tight">৳{fee ?? '—'}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Notes <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe your symptoms or reason for visit…"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
          />
        </div>

        <button
          onClick={handleConfirm}
          disabled={loading}
          className="w-full bg-teal-600 text-white py-4 rounded-2xl font-bold text-base hover:bg-teal-700 transition-colors disabled:opacity-50 shadow-md shadow-teal-200"
        >
          {loading ? 'Confirming…' : 'Confirm Booking'}
        </button>
      </div>
    </div>
  );
}
