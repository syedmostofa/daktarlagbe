import { useState, useEffect } from 'react';
import { getMyNotificationsApi, markNotificationReadApi, markAllNotificationsReadApi } from '../api/notificationsApi';
import toast from 'react-hot-toast';
import { Bell, Check, CheckCheck } from 'lucide-react';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load = (p = page) => {
    setLoading(true);
    getMyNotificationsApi({ page: p, limit: 20 })
      .then((res) => {
        setNotifications(res.data.notifications ?? []);
        setUnreadCount(res.data.unread_count ?? 0);
        setTotalPages(res.data.pagination?.totalPages ?? 1);
      })
      .catch(() => toast.error('Failed to load notifications.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [page]);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationReadApi(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {
      toast.error('Failed to mark as read.');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsReadApi();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
      toast.success('All marked as read.');
    } catch {
      toast.error('Failed to mark all as read.');
    }
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="bg-teal-100 text-teal-600 rounded-xl p-2.5">
              <Bell size={20} />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Notifications</h1>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">{unreadCount}</span>
            )}
          </div>
          <p className="text-gray-500 text-sm ml-14">Stay up to date with your appointments</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-700 bg-teal-50 px-4 py-2 rounded-xl border border-teal-100 hover:bg-teal-100 transition-colors"
          >
            <CheckCheck size={16} /> Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-200">
          <Bell size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-semibold text-gray-500">No notifications yet</p>
          <p className="text-sm text-gray-400 mt-1.5">You&apos;ll be notified about your appointments here.</p>
        </div>
      ) : (
        <>
          <div className="space-y-2.5">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`rounded-2xl border p-5 transition-colors ${
                  n.is_read
                    ? 'bg-white border-gray-200'
                    : 'bg-teal-50 border-teal-200'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {!n.is_read && (
                        <span className="w-2 h-2 rounded-full bg-teal-500 flex-shrink-0" />
                      )}
                      <p className="text-sm font-bold text-gray-900">{n.title}</p>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-2 font-medium">{timeAgo(n.created_at)}</p>
                  </div>
                  {!n.is_read && (
                    <button
                      onClick={() => handleMarkRead(n.id)}
                      className="text-teal-500 hover:text-teal-700 flex-shrink-0 bg-white border border-teal-200 rounded-lg p-1.5 hover:bg-teal-50 transition-colors"
                      title="Mark as read"
                    >
                      <Check size={15} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-5 py-2.5 text-sm font-medium border border-gray-200 rounded-xl disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2.5 text-sm font-medium text-gray-500">
                {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-5 py-2.5 text-sm font-medium border border-gray-200 rounded-xl disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
