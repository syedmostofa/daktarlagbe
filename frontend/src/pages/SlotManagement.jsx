import { useState, useEffect } from 'react';
import { getMeApi } from '../api/authApi';
import { getDoctorSlotsApi, createSlotApi, deleteSlotApi } from '../api/doctorsApi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { Calendar, Clock, Trash2, Plus, X } from 'lucide-react';
import CalendarPicker from '../components/CalendarPicker';

export default function SlotManagement() {
  const [doctorId, setDoctorId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newSlot, setNewSlot] = useState({ start_time: '09:00', end_time: '09:30' });

  useEffect(() => {
    getMeApi()
      .then((res) => {
        if (res.data.doctor) setDoctorId(res.data.doctor.id);
      })
      .catch(() => toast.error('Failed to load profile.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!doctorId || !selectedDate) return;
    loadSlots();
  }, [doctorId, selectedDate]);

  const loadSlots = () => {
    if (!doctorId) return;
    getDoctorSlotsApi(doctorId, format(selectedDate, 'yyyy-MM-dd'))
      .then((res) => setSlots(res.data.slots ?? []))
      .catch(() => toast.error('Failed to load slots.'));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (newSlot.start_time >= newSlot.end_time) {
      return toast.error('End time must be after start time.');
    }
    setCreating(true);
    try {
      await createSlotApi({
        slot_date: format(selectedDate, 'yyyy-MM-dd'),
        start_time: newSlot.start_time,
        end_time: newSlot.end_time,
      });
      toast.success('Slot created!');
      setShowForm(false);
      setNewSlot({ start_time: '09:00', end_time: '09:30' });
      loadSlots();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create slot.');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (slotId) => {
    if (!confirm('Delete this slot?')) return;
    try {
      await deleteSlotApi(slotId);
      toast.success('Slot deleted.');
      loadSlots();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete slot.');
    }
  };

  const formatTime = (t) => {
    if (!t) return '';
    const [h, m] = t.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${period}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!doctorId) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center text-gray-400">
        <p className="font-medium">Please set up your doctor profile first.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="bg-teal-100 text-teal-600 rounded-xl p-2">
              <Calendar size={20} />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Manage Slots</h1>
          </div>
          <p className="text-gray-500 ml-11">Set your availability for patients to book</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm ${
            showForm
              ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              : 'bg-teal-600 text-white hover:bg-teal-700'
          }`}
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Cancel' : 'Add Slot'}
        </button>
      </div>

      {/* Date picker */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Select Date</label>
        <CalendarPicker selected={selectedDate} onChange={setSelectedDate} />
      </div>

      {/* Add slot form */}
      {showForm && (
        <form onSubmit={handleCreate} className="bg-teal-50 rounded-2xl border border-teal-100 p-6 mb-6">
          <p className="text-sm font-bold text-teal-800 mb-4">
            New slot — {format(selectedDate, 'EEEE, dd MMM yyyy')}
          </p>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Start Time</label>
              <input
                type="time"
                value={newSlot.start_time}
                onChange={(e) => setNewSlot((p) => ({ ...p, start_time: e.target.value }))}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">End Time</label>
              <input
                type="time"
                value={newSlot.end_time}
                onChange={(e) => setNewSlot((p) => ({ ...p, end_time: e.target.value }))}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              />
            </div>
            <button
              type="submit"
              disabled={creating}
              className="bg-teal-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-teal-700 disabled:opacity-50 transition-colors whitespace-nowrap"
            >
              {creating ? 'Creating…' : 'Create Slot'}
            </button>
          </div>
        </form>
      )}

      {/* Slots list */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <h2 className="text-sm font-bold text-gray-700 mb-5">
          Slots for {format(selectedDate, 'EEEE, dd MMM yyyy')}
        </h2>
        {slots.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <Clock size={36} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium text-gray-500">No slots for this date</p>
            <p className="text-sm mt-1">Click &quot;Add Slot&quot; to create availability.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {slots.map((slot) => (
              <div
                key={slot.id}
                className={`flex items-center justify-between px-5 py-3.5 rounded-xl border ${
                  slot.is_booked
                    ? 'bg-red-50 border-red-100'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100 transition-colors'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Clock size={15} className={slot.is_booked ? 'text-red-400' : 'text-teal-600'} />
                  <span className="text-sm font-semibold text-gray-800">
                    {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
                  </span>
                  {slot.is_booked && (
                    <span className="text-xs bg-red-100 text-red-600 px-2.5 py-0.5 rounded-full font-semibold">Booked</span>
                  )}
                </div>
                {!slot.is_booked && (
                  <button
                    onClick={() => handleDelete(slot.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    title="Delete slot"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
