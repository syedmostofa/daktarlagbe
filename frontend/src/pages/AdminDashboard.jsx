import { useState, useEffect } from 'react';
import { getAdminStatsApi, getAdminUsersApi, updateUserRoleApi, deleteUserApi } from '../api/adminApi';
import toast from 'react-hot-toast';
import { Shield, Users, Calendar, Banknote, Trash2, Search } from 'lucide-react';

const TABS = ['overview', 'users'];

export default function AdminDashboard() {
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [userPagination, setUserPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [userSearch, setUserSearch] = useState('');

  useEffect(() => {
    if (tab === 'overview') {
      setLoading(true);
      getAdminStatsApi()
        .then((res) => setStats(res.data.stats))
        .catch(() => toast.error('Failed to load stats.'))
        .finally(() => setLoading(false));
    }
  }, [tab]);

  useEffect(() => {
    if (tab === 'users') loadUsers();
  }, [tab, userPagination.page, roleFilter]);

  const loadUsers = () => {
    setLoading(true);
    getAdminUsersApi({ page: userPagination.page, limit: 20, role: roleFilter || undefined, search: userSearch || undefined })
      .then((res) => {
        setUsers(res.data.users ?? []);
        setUserPagination((p) => ({ ...p, totalPages: res.data.pagination?.totalPages ?? 1 }));
      })
      .catch(() => toast.error('Failed to load users.'))
      .finally(() => setLoading(false));
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRoleApi(userId, newRole);
      toast.success('Role updated.');
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update role.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Delete this user permanently?')) return;
    try {
      await deleteUserApi(userId);
      toast.success('User deleted.');
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete user.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-teal-100 text-teal-600 rounded-xl p-2.5">
          <Shield size={22} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage users and monitor platform activity</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-2xl p-1.5 mb-8 max-w-xs">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all ${
              tab === t ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : tab === 'overview' && stats ? (
        <div className="space-y-6">
          {/* Stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard icon={Users} label="Total Users" value={stats.total_users} color="text-blue-600 bg-blue-50" />
            <StatCard icon={Users} label="Doctors" value={stats.total_doctors} color="text-teal-600 bg-teal-50" />
            <StatCard icon={Calendar} label="Appointments" value={stats.appointments.total} color="text-purple-600 bg-purple-50" />
            <StatCard icon={Banknote} label="Revenue" value={`৳${stats.total_revenue.toLocaleString()}`} color="text-green-600 bg-green-50" />
          </div>

          {/* Appointment breakdown */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <h2 className="font-bold text-gray-900 text-lg mb-6">Appointment Breakdown</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Object.entries(stats.appointments).filter(([k]) => k !== 'total').map(([status, count]) => (
                <div key={status} className="text-center p-5 rounded-2xl bg-gray-50 border border-gray-100">
                  <p className="text-2xl font-extrabold text-gray-800">{count}</p>
                  <p className="text-xs font-medium text-gray-500 capitalize mt-1">{status}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : tab === 'users' ? (
        <div>
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setUserPagination((p) => ({ ...p, page: 1 })); }}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">All Roles</option>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
            </select>
            <form onSubmit={(e) => { e.preventDefault(); loadUsers(); }} className="flex gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search name or email…"
                  className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm w-64 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <button type="submit" className="bg-teal-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors">
                Search
              </button>
            </form>
          </div>

          {/* Users table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-6 py-4 font-semibold text-gray-600 text-xs uppercase tracking-wide">Name</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-600 text-xs uppercase tracking-wide">Email</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-600 text-xs uppercase tracking-wide">Role</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-600 text-xs uppercase tracking-wide">Joined</th>
                    <th className="text-right px-6 py-4 font-semibold text-gray-600 text-xs uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-800">{u.name}</td>
                      <td className="px-6 py-4 text-gray-500">{u.email}</td>
                      <td className="px-6 py-4">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                          <option value="patient">Patient</option>
                          <option value="doctor">Doctor</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-xs font-medium">
                        {new Date(u.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors p-1"
                          title="Delete user"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {userPagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => setUserPagination((p) => ({ ...p, page: Math.max(1, p.page - 1) }))}
                disabled={userPagination.page === 1}
                className="px-5 py-2.5 text-sm font-medium border border-gray-200 rounded-xl disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2.5 text-sm font-medium text-gray-500">
                {userPagination.page} of {userPagination.totalPages}
              </span>
              <button
                onClick={() => setUserPagination((p) => ({ ...p, page: Math.min(p.totalPages, p.page + 1) }))}
                disabled={userPagination.page === userPagination.totalPages}
                className="px-5 py-2.5 text-sm font-medium border border-gray-200 rounded-xl disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mb-4`}>
        <Icon size={22} />
      </div>
      <p className="text-3xl font-extrabold text-gray-900 tracking-tight">{value}</p>
      <p className="text-sm font-medium text-gray-500 mt-1">{label}</p>
    </div>
  );
}
