import { Link } from 'react-router-dom';
import { MapPin, Clock, Star } from 'lucide-react';

const PLACEHOLDER_AVATAR = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name ?? 'Doctor')}&background=ccfbf1&color=0f766e&size=128`;

export default function DoctorCard({ doctor }) {
  const avatarSrc = doctor.profile_picture || PLACEHOLDER_AVATAR(doctor.name);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col">
      <div className="p-6 flex items-start gap-4 flex-1">
        <img
          src={avatarSrc}
          alt={doctor.name}
          onError={(e) => { e.currentTarget.src = PLACEHOLDER_AVATAR(doctor.name); }}
          className="w-16 h-16 rounded-2xl object-cover flex-shrink-0 bg-teal-50 ring-2 ring-teal-100"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-base truncate leading-snug">
            Dr. {doctor.name}
          </h3>
          <p className="text-teal-600 text-sm font-semibold mt-0.5">
            {doctor.specialization || doctor.specialty}
          </p>

          <div className="mt-3 flex flex-col gap-1.5">
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <MapPin size={12} className="text-gray-400 flex-shrink-0" />
              <span className="truncate">{doctor.district || doctor.location || 'Bangladesh'}</span>
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <Clock size={12} className="text-gray-400 flex-shrink-0" />
              {doctor.experience_years ?? '—'} yrs experience
            </span>
            {(doctor.avg_rating > 0 || doctor.total_reviews > 0) && (
              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <Star size={12} className="text-yellow-400 fill-yellow-400 flex-shrink-0" />
                <span className="font-medium text-gray-700">{doctor.avg_rating}</span>
                <span className="text-gray-400">({doctor.total_reviews} reviews)</span>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 flex items-center justify-between border-t border-gray-100 pt-4">
        <div>
          <span className="text-xs text-gray-400 block mb-0.5">Consultation fee</span>
          <span className="text-base font-bold text-gray-900 flex items-center gap-0.5">
            <span>৳</span>
            {doctor.consultation_fee ?? '—'}
          </span>
        </div>

        <Link
          to={`/doctors/${doctor.id}`}
          className="bg-teal-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-teal-700 active:scale-95 transition-all shadow-sm"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
}
