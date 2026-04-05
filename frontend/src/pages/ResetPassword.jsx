import { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { resetPasswordApi } from '../api/authApi';
import toast from 'react-hot-toast';
import { Lock } from 'lucide-react';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error('Passwords do not match.');
    }
    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters.');
    }
    if (!token) {
      return toast.error('Invalid reset link. Please request a new one.');
    }

    setLoading(true);
    try {
      await resetPasswordApi(token, password);
      toast.success('Password reset successfully!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Reset failed. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-gray-200 shadow-md p-10">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-teal-600 text-white p-4 rounded-2xl mb-4 shadow-md shadow-teal-200">
            <Lock size={26} />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Reset Password</h1>
          <p className="text-gray-500 mt-2">Enter your new password below.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Minimum 6 characters"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Re-enter your new password"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 text-white py-3.5 rounded-xl font-bold hover:bg-teal-700 transition-colors disabled:opacity-50 shadow-sm"
          >
            {loading ? 'Resetting…' : 'Set New Password'}
          </button>
          <p className="text-center text-sm text-gray-500">
            Remember it?{' '}
            <Link to="/login" className="text-teal-600 font-semibold hover:underline">Back to Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
