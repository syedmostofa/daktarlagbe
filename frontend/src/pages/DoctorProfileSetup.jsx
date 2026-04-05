import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createDoctorProfileApi } from '../api/doctorsApi';
import toast from 'react-hot-toast';
import { Stethoscope } from 'lucide-react';

const SPECIALTIES = [
  'General Physician', 'Cardiologist', 'Dentist', 'Dermatologist',
  'Gynecologist', 'Neurologist', 'Orthopedic', 'Pediatrician',
  'Psychiatrist', 'ENT Specialist', 'Ophthalmologist', 'Urologist',
];

const DISTRICTS = [
  'Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna',
  'Barishal', 'Rangpur', 'Mymensingh', 'Comilla', 'Gazipur',
];

export default function DoctorProfileSetup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    specialization: '',
    qualification: '',
    experience_years: '',
    consultation_fee: '',
    district: '',
    bio: '',
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createDoctorProfileApi({
        ...form,
        experience_years: Number(form.experience_years),
        consultation_fee: Number(form.consultation_fee),
      });
      toast.success('Doctor profile created successfully!');
      navigate('/doctor/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-teal-100 text-teal-600 rounded-xl p-2.5">
          <Stethoscope size={22} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Set Up Your Profile</h1>
          <p className="text-gray-500 text-sm mt-0.5">Complete your profile to start accepting appointments.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Specialization <span className="text-red-400">*</span></label>
          <select
            name="specialization"
            value={form.specialization}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
          >
            <option value="">Select your specialization</option>
            {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Qualification <span className="text-red-400">*</span></label>
          <input
            type="text"
            name="qualification"
            value={form.qualification}
            onChange={handleChange}
            required
            placeholder="e.g. MBBS, FCPS (Medicine)"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Experience (years) <span className="text-red-400">*</span></label>
            <input
              type="number"
              name="experience_years"
              value={form.experience_years}
              onChange={handleChange}
              required
              min="0"
              placeholder="e.g. 5"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Consultation Fee (BDT) <span className="text-red-400">*</span></label>
            <input
              type="number"
              name="consultation_fee"
              value={form.consultation_fee}
              onChange={handleChange}
              required
              min="0"
              placeholder="e.g. 500"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">District <span className="text-red-400">*</span></label>
          <select
            name="district"
            value={form.district}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
          >
            <option value="">Select your district</option>
            {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Bio <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows={4}
            placeholder="Tell patients about yourself, your practice, and specialties…"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-600 text-white py-3.5 rounded-xl font-bold hover:bg-teal-700 transition-colors disabled:opacity-50 shadow-sm"
        >
          {loading ? 'Creating Profile…' : 'Create Profile'}
        </button>
      </form>
    </div>
  );
}
