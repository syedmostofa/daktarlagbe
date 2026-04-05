import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfileApi, changePasswordApi } from '../api/authApi';
import toast from 'react-hot-toast';
import { User, Lock } from 'lucide-react';

export default function PatientProfile() {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [pwForm, setPwForm] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [changingPw, setChangingPw] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', phone: user.phone || '' });
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfileApi(form);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (pwForm.new_password !== pwForm.confirm_password) {
      return toast.error('Passwords do not match.');
    }
    setChangingPw(true);
    try {
      await changePasswordApi(pwForm.current_password, pwForm.new_password);
      toast.success('Password changed!');
      setPwForm({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to change password.');
    } finally {
      setChangingPw(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-teal-100 text-teal-600 rounded-xl p-2.5">
          <User size={22} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Profile</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage your account information</p>
        </div>
      </div>

      {/* Profile info */}
      <form onSubmit={handleProfileSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-5 mb-6">
        <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="w-full px-4 py-3 border border-gray-100 rounded-xl text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone number</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
            placeholder="01XXXXXXXXX"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-3 py-3 px-4 bg-gray-50 rounded-xl text-sm">
          <span className="text-gray-500">Role:</span>
          <span className="capitalize font-semibold text-gray-800 bg-white border border-gray-200 px-2.5 py-0.5 rounded-lg text-xs">{user?.role}</span>
          {user?.created_at && (
            <>
              <span className="text-gray-300">·</span>
              <span className="text-gray-500">Joined {new Date(user.created_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</span>
            </>
          )}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-teal-600 text-white py-3.5 rounded-xl font-bold hover:bg-teal-700 transition-colors disabled:opacity-50 shadow-sm"
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </form>

      {/* Change Password */}
      <form onSubmit={handlePasswordSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="bg-gray-100 text-gray-600 rounded-xl p-2.5">
            <Lock size={18} />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Change Password</h2>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Current Password</label>
          <input
            type="password"
            value={pwForm.current_password}
            onChange={(e) => setPwForm((p) => ({ ...p, current_password: e.target.value }))}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">New Password</label>
          <input
            type="password"
            value={pwForm.new_password}
            onChange={(e) => setPwForm((p) => ({ ...p, new_password: e.target.value }))}
            required
            minLength={6}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm New Password</label>
          <input
            type="password"
            value={pwForm.confirm_password}
            onChange={(e) => setPwForm((p) => ({ ...p, confirm_password: e.target.value }))}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <button
          type="submit"
          disabled={changingPw}
          className="w-full bg-gray-800 text-white py-3.5 rounded-xl font-bold hover:bg-gray-900 transition-colors disabled:opacity-50 shadow-sm"
        >
          {changingPw ? 'Changing…' : 'Change Password'}
        </button>
      </form>
    </div>
  );
}
