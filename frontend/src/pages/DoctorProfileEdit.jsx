import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMeApi } from '../api/authApi';
import { updateDoctorProfileApi } from '../api/doctorsApi';
import toast from 'react-hot-toast';
import { Settings } from 'lucide-react';

const SPECIALTIES = [
  'General Physician', 'Cardiologist', 'Dentist', 'Dermatologist',
  'Gynecologist', 'Neurologist', 'Orthopedic', 'Pediatrician',
  'Psychiatrist', 'ENT Specialist', 'Ophthalmologist', 'Urologist',
];

const DISTRICTS = [
  'Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna',
  'Barishal', 'Rangpur', 'Mymensingh', 'Comilla', 'Gazipur',
];

export default function DoctorProfileEdit() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [doctorId, setDoctorId] = useState(null);
  const [form, setForm] = useState({
    specialization: '',
    qualification: '',
    experience_years: '',
    consultation_fee: '',
    district: '',
    bio: '',
    available: true,
  });

  useEffect(() => {
    getMeApi()
      .then((res) => {
        const doc = res.data.doctor;
        if (doc) {
          setDoctorId(doc.id);
          setForm({
            specialization: doc.specialization || '',
            qualification: doc.qualification || '',
            experience_years: doc.experience_years || '',
            consultation_fee: doc.consultation_fee || '',
            district: doc.district || '',
            bio: doc.bio || '',
            available: doc.available !== false,
          });
        }
      })
      .catch(() => toast.error('Failed to load profile.'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!doctorId) {
      toast.error('Doctor profile not found. Please create one first.');
      return navigate('/doctor/setup');
    }
    setSaving(true);
    try {
      await updateDoctorProfileApi(doctorId, {
        ...form,
        experience_years: Number(form.experience_years),
        consultation_fee: Number(form.consultation_fee),
      });
      toast.success('Profile updated successfully!');
      navigate('/doctor/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-teal-100 text-teal-600 rounded-xl p-2.5">
          <Settings size={22} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Edit Profile</h1>
          <p className="text-gray-500 text-sm mt-0.5">Update your professional information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Specialization</label>
          <select
            name="specialization"
            value={form.specialization}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
          >
            <option value="">Select specialization</option>
            {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Qualification</label>
          <input
            type="text"
            name="qualification"
            value={form.qualification}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Experience (years)</label>
            <input
              type="number"
              name="experience_years"
              value={form.experience_years}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Fee (BDT)</label>
            <input
              type="number"
              name="consultation_fee"
              value={form.consultation_fee}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">District</label>
          <select
            name="district"
            value={form.district}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
          >
            <option value="">Select district</option>
            {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Bio</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
          />
        </div>

        <div className="flex items-center gap-3 py-3 px-4 bg-gray-50 rounded-xl">
          <input
            type="checkbox"
            name="available"
            id="available"
            checked={form.available}
            onChange={handleChange}
            className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 accent-teal-600"
          />
          <label htmlFor="available" className="text-sm font-medium text-gray-700 cursor-pointer">
            Available for appointments
          </label>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-teal-600 text-white py-3.5 rounded-xl font-bold hover:bg-teal-700 transition-colors disabled:opacity-50 shadow-sm"
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
