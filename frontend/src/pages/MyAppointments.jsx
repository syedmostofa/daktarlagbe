import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyAppointmentsApi, cancelAppointmentApi } from '../api/appointmentsApi';
import AppointmentCard from '../components/AppointmentCard';
import toast from 'react-hot-toast';
import { CalendarX } from 'lucide-react';

export default function MyAppointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getMyAppointmentsApi()
      .then((res) => setAppointments(res.data.appointments ?? res.data ?? []))
      .catch(() => toast.error('Failed to load appointments.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this appointment?')) return;
    try {
      await cancelAppointmentApi(id);
      toast.success('Appointment cancelled.');
      load();
    } catch {
      toast.error('Failed to cancel.');
    }
  };

  const handlePay = (appointment) => {
    navigate(`/payment/${appointment.id}`, {
      state: {
        fee: appointment.consultation_fee,
        doctorName: appointment.doctor_name,
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Appointments</h1>
        <p className="text-gray-500 mt-1.5">Track and manage your upcoming visits</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-24 text-gray-400 bg-white rounded-2xl border border-gray-200">
          <CalendarX size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-semibold text-gray-500">No appointments yet</p>
          <p className="text-sm mt-1.5">Book a consultation with a verified doctor to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((apt) => (
            <AppointmentCard
              key={apt.id}
              appointment={apt}
              onCancel={handleCancel}
              onPay={handlePay}
            />
          ))}
        </div>
      )}
    </div>
  );
}
