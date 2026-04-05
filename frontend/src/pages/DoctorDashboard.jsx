import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDoctorAppointmentsApi, updateAppointmentStatusApi, cancelAppointmentApi } from '../api/appointmentsApi';
import AppointmentCard from '../components/AppointmentCard';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { LayoutDashboard, Calendar, Settings } from 'lucide-react';

const TABS = ['pending', 'confirmed', 'completed', 'cancelled'];

const TAB_COLORS = {
  pending: 'text-amber-600',
  confirmed: 'text-green-600',
  completed: 'text-gray-600',
  cancelled: 'text-red-500',
};

const STAT_BG = {
  pending:   'bg-amber-50 border-amber-100',
  confirmed: 'bg-green-50 border-green-100',
  completed: 'bg-gray-50 border-gray-100',
  cancelled: 'bg-red-50 border-red-100',
};

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('pending');

  const load = () => {
    setLoading(true);
    getDoctorAppointmentsApi()
      .then((res) => setAppointments(res.data.appointments ?? res.data ?? []))
      .catch(() => toast.error('Failed to load appointments.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateAppointmentStatusApi(id, status);
      toast.success(`Appointment ${status}.`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update status.');
    }
  };

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

  const filtered = appointments.filter((a) => a.status === tab);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="bg-teal-100 text-teal-600 rounded-xl p-2">
              <LayoutDashboard size={20} />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
          </div>
          <p className="text-gray-500 ml-11">Welcome back, Dr. {user?.name?.split(' ')[0]}</p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/doctor/slots"
            className="flex items-center gap-1.5 text-sm font-semibold text-teal-600 border border-teal-200 bg-teal-50 px-4 py-2 rounded-xl hover:bg-teal-100 transition-colors"
          >
            <Calendar size={15} /> Manage Slots
          </Link>
          <Link
            to="/doctor/edit-profile"
            className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 border border-gray-200 bg-white px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Settings size={15} /> Edit Profile
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {TABS.map((t) => {
          const count = appointments.filter((a) => a.status === t).length;
          return (
            <div key={t} className={`rounded-2xl border p-5 text-center ${STAT_BG[t]}`}>
              <p className={`text-3xl font-extrabold ${TAB_COLORS[t]}`}>{count}</p>
              <p className="text-xs font-medium text-gray-500 capitalize mt-1">{t}</p>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-2xl p-1.5 mb-7">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-semibold capitalize transition-all ${
              tab === t
                ? 'bg-white text-teal-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-base font-medium">No {tab} appointments.</p>
          <p className="text-sm mt-1">Check back later.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((apt) => (
            <AppointmentCard
              key={apt.id}
              appointment={apt}
              isDoctor
              onStatusChange={handleStatusChange}
              onCancel={(tab === 'pending' || tab === 'confirmed') ? handleCancel : null}
            />
          ))}
        </div>
      )}
    </div>
  );
}
