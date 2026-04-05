import { Calendar, Clock } from 'lucide-react';

const STATUS_STYLES = {
  pending:   'bg-amber-100 text-amber-700 border border-amber-200',
  confirmed: 'bg-green-100 text-green-700 border border-green-200',
  cancelled: 'bg-red-100 text-red-600 border border-red-200',
  completed: 'bg-gray-100 text-gray-600 border border-gray-200',
};

function formatTime(t) {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${period}`;
}

export default function AppointmentCard({ appointment, onCancel, onStatusChange, isDoctor, onPay }) {
  const {
    id, status, notes, slot_date, start_time, end_time,
    doctor_name, specialization, consultation_fee,
    patient_name, patient_phone,
  } = appointment;

  const displayName = isDoctor ? patient_name : `Dr. ${doctor_name}`;
  const subtitle = isDoctor ? patient_phone : specialization;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-base flex-shrink-0">
            {displayName?.charAt(isDoctor ? 0 : 4) ?? '?'}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm leading-snug">{displayName}</p>
            {subtitle && <p className="text-teal-600 text-xs font-medium mt-0.5">{subtitle}</p>}
          </div>
        </div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize whitespace-nowrap ${STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-600'}`}>
          {status}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
        {slot_date && (
          <span className="flex items-center gap-1.5">
            <Calendar size={14} className="text-gray-400" />
            {new Date(slot_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        )}
        {start_time && (
          <span className="flex items-center gap-1.5">
            <Clock size={14} className="text-gray-400" />
            {formatTime(start_time)}{end_time ? ` – ${formatTime(end_time)}` : ''}
          </span>
        )}
        {!isDoctor && consultation_fee && (
          <span className="font-semibold text-gray-800">৳{consultation_fee}</span>
        )}
      </div>

      {notes && (
        <p className="mt-3 text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2 line-clamp-2">
          {notes}
        </p>
      )}

      {/* Action buttons */}
      <div className="mt-5 flex gap-2.5">
        {/* Patient actions */}
        {onCancel && (status === 'pending' || status === 'confirmed') && (
          <button
            onClick={() => onCancel(id)}
            className="flex-1 text-center py-2.5 text-sm font-semibold text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
          >
            Cancel
          </button>
        )}
        {onPay && (status === 'pending' || status === 'confirmed') && (
          <button
            onClick={() => onPay(appointment)}
            className="flex-1 text-center py-2.5 text-sm font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700 transition-colors"
          >
            Pay ৳{consultation_fee || '—'}
          </button>
        )}

        {/* Doctor actions */}
        {onStatusChange && status === 'pending' && (
          <button
            onClick={() => onStatusChange(id, 'confirmed')}
            className="flex-1 text-center py-2.5 text-sm font-semibold text-white bg-teal-600 rounded-xl hover:bg-teal-700 transition-colors"
          >
            Confirm
          </button>
        )}
        {onStatusChange && status === 'confirmed' && (
          <button
            onClick={() => onStatusChange(id, 'completed')}
            className="flex-1 text-center py-2.5 text-sm font-semibold text-white bg-gray-700 rounded-xl hover:bg-gray-800 transition-colors"
          >
            Mark Completed
          </button>
        )}
      </div>
    </div>
  );
}
