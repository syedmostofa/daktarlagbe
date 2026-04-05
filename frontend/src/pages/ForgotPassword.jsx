import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPasswordApi } from '../api/authApi';
import toast from 'react-hot-toast';
import { Mail, ArrowLeft, KeyRound } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPasswordApi(email);
      setSent(true);
      toast.success('If an account exists, a reset link has been sent.');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link to="/login" className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-700 mb-8">
          <ArrowLeft size={15} /> Back to Login
        </Link>

        {sent ? (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-md p-10 text-center">
            <div className="bg-teal-100 text-teal-600 rounded-2xl p-5 inline-flex mb-5">
              <Mail size={32} />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Check your email</h1>
            <p className="text-gray-500 leading-relaxed">
              If an account with <strong className="text-gray-700">{email}</strong> exists, you&apos;ll receive a password reset link shortly.
            </p>
            <Link
              to="/login"
              className="inline-block mt-8 bg-teal-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-teal-700 transition-colors text-sm"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-md p-10">
            <div className="flex flex-col items-center mb-8">
              <div className="bg-teal-600 text-white p-4 rounded-2xl mb-4 shadow-md shadow-teal-200">
                <KeyRound size={26} />
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Forgot Password?</h1>
              <p className="text-gray-500 mt-2 text-center">Enter your email and we&apos;ll send you a reset link.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-600 text-white py-3.5 rounded-xl font-bold hover:bg-teal-700 transition-colors disabled:opacity-50 shadow-sm"
              >
                {loading ? 'Sending…' : 'Send Reset Link'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
