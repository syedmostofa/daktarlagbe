import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, CalendarCheck, UserCheck, ShieldCheck } from 'lucide-react';

const POPULAR_SPECIALTIES = [
  { label: 'General Physician', icon: '🩺' },
  { label: 'Cardiologist', icon: '❤️' },
  { label: 'Dentist', icon: '🦷' },
  { label: 'Dermatologist', icon: '🧴' },
  { label: 'Pediatrician', icon: '👶' },
  { label: 'Orthopedic', icon: '🦴' },
];

const HOW_IT_WORKS = [
  {
    step: '1',
    icon: <Search size={26} className="text-teal-600" />,
    title: 'Search a Doctor',
    desc: 'Find doctors by name, specialty, or location across Bangladesh.',
  },
  {
    step: '2',
    icon: <CalendarCheck size={26} className="text-teal-600" />,
    title: 'Book an Appointment',
    desc: 'Pick a convenient date and time slot from available schedules.',
  },
  {
    step: '3',
    icon: <UserCheck size={26} className="text-teal-600" />,
    title: 'Visit the Doctor',
    desc: "Show up at the clinic and get the care you need. It's that simple.",
  },
];

export default function Home() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('name', query.trim());
    navigate(`/doctors?${params.toString()}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-600 via-teal-600 to-teal-800 text-white py-28 md:py-36 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-teal-500/40 text-teal-100 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 border border-teal-400/30">
            <ShieldCheck size={13} /> BMDC Verified Doctors
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-5 leading-tight tracking-tight">
            Find &amp; Book Top Doctors<br className="hidden sm:block" /> in Bangladesh
          </h1>
          <p className="text-teal-100 text-lg md:text-xl mb-10 font-medium">
            Trusted by thousands of patients. Verified doctors across every major city.
          </p>

          {/* Hero search bar */}
          <form onSubmit={handleHeroSearch} className="flex items-center bg-white rounded-2xl shadow-2xl overflow-hidden max-w-xl mx-auto">
            <Search size={18} className="ml-5 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by doctor name or specialty..."
              className="flex-1 px-4 py-4 text-gray-800 text-sm focus:outline-none placeholder-gray-400"
            />
            <button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold px-6 py-4 transition-colors"
            >
              Search
            </button>
          </form>

          <p className="text-teal-200 text-sm mt-5">
            Or{' '}
            <Link to="/doctors" className="underline underline-offset-4 hover:text-white font-medium">
              browse all doctors
            </Link>
          </p>
        </div>
      </section>

      {/* Popular Specialties */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">Popular Specialties</h2>
          <p className="text-center text-gray-500 mb-10">Browse doctors by what you need</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {POPULAR_SPECIALTIES.map(({ label, icon }) => (
              <Link
                key={label}
                to={`/doctors?specialty=${encodeURIComponent(label)}`}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-teal-300 transition-all duration-200 p-6 flex flex-col items-center gap-3 group"
              >
                <span className="text-4xl">{icon}</span>
                <span className="text-xs font-semibold text-gray-600 text-center group-hover:text-teal-600 leading-snug">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">How It Works</h2>
          <p className="text-center text-gray-500 mb-14">Book your appointment in 3 easy steps</p>

          <div className="grid md:grid-cols-3 gap-10 relative">
            <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-0.5 bg-teal-100" />

            {HOW_IT_WORKS.map(({ step, icon, title, desc }) => (
              <div key={step} className="flex flex-col items-center text-center">
                <div className="relative mb-5">
                  <div className="w-20 h-20 rounded-2xl bg-teal-50 border-2 border-teal-100 flex items-center justify-center shadow-sm">
                    {icon}
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center shadow-md">
                    {step}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link
              to="/doctors"
              className="inline-flex items-center gap-2.5 bg-teal-600 text-white font-bold px-8 py-3.5 rounded-2xl hover:bg-teal-700 active:scale-95 transition-all shadow-lg shadow-teal-200"
            >
              <Search size={17} />
              Get Started — It&apos;s Free
            </Link>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="py-14 px-4 bg-teal-600 text-white">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-10 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="bg-teal-500/40 rounded-xl p-3">
              <ShieldCheck size={28} />
            </div>
            <div>
              <p className="font-bold">BMDC Verified Doctors</p>
              <p className="text-teal-200 text-sm">All doctors are licensed &amp; verified</p>
            </div>
          </div>
          <div className="hidden sm:block w-px h-12 bg-teal-500" />
          <div className="flex items-center gap-4">
            <div className="bg-teal-500/40 rounded-xl p-3">
              <CalendarCheck size={28} />
            </div>
            <div>
              <p className="font-bold">Instant Booking</p>
              <p className="text-teal-200 text-sm">Confirm appointments in seconds</p>
            </div>
          </div>
          <div className="hidden sm:block w-px h-12 bg-teal-500" />
          <div className="flex items-center gap-4">
            <div className="bg-teal-500/40 rounded-xl p-3">
              <UserCheck size={28} />
            </div>
            <div>
              <p className="font-bold">Trusted by Patients</p>
              <p className="text-teal-200 text-sm">Thousands of successful bookings</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
