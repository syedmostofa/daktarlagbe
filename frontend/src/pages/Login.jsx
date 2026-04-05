import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Stethoscope } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form);
      toast.success(`Welcome back, ${user.name?.split(' ')[0]}!`);
      navigate(user.role === 'doctor' ? '/doctor/dashboard' : user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-md border border-gray-200 p-10">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-teal-600 text-white p-4 rounded-2xl mb-4 shadow-md shadow-teal-200">
            <Stethoscope size={28} />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Sign in to your daktarlagbe account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow"
            />
          </div>
          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm text-teal-600 hover:text-teal-700 font-medium hover:underline">
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 text-white py-3.5 rounded-xl font-bold hover:bg-teal-700 transition-colors disabled:opacity-60 shadow-sm text-base"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-7">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-teal-600 font-semibold hover:underline">
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
}
