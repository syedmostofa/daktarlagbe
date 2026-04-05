import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { UserPlus } from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'patient' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await register(form);
      toast.success('Account created successfully!');
      navigate(user.role === 'doctor' ? '/doctor/dashboard' : '/');
    } catch (err) {
      const data = err.response?.data;
      const message = data?.error || data?.errors?.[0]?.msg || 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-md border border-gray-200 p-10">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-teal-600 text-white p-4 rounded-2xl mb-4 shadow-md shadow-teal-200">
            <UserPlus size={28} />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create Account</h1>
          <p className="text-gray-500 mt-2">Join daktarlagbe today — it&apos;s free</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
            <input
              type="text" name="name" value={form.name} onChange={handleChange} required
              placeholder="Rahim Uddin"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
            <input
              type="email" name="email" value={form.email} onChange={handleChange} required
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone number</label>
            <input
              type="tel" name="phone" value={form.phone} onChange={handleChange} required
              placeholder="01XXXXXXXXX"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
            <input
              type="password" name="password" value={form.password} onChange={handleChange} required
              placeholder="Minimum 6 characters"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">I am registering as</label>
            <select
              name="role" value={form.role} onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
            >
              <option value="patient">Patient — I want to book appointments</option>
              <option value="doctor">Doctor — I want to offer consultations</option>
            </select>
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full bg-teal-600 text-white py-3.5 rounded-xl font-bold hover:bg-teal-700 transition-colors disabled:opacity-60 shadow-sm text-base"
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-7">
          Already have an account?{' '}
          <Link to="/login" className="text-teal-600 font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
