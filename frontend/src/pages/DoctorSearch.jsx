import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getDoctorsApi } from '../api/doctorsApi';
import DoctorCard from '../components/DoctorCard';
import { Search, SlidersHorizontal } from 'lucide-react';
import toast from 'react-hot-toast';

const SPECIALTIES = [
  'General Physician', 'Cardiologist', 'Dentist', 'Dermatologist',
  'Gynecologist', 'Neurologist', 'Orthopedic', 'Pediatrician', 'Psychiatrist',
];

const LOCATIONS = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barishal', 'Rangpur', 'Mymensingh'];

export default function DoctorSearch() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [name, setName] = useState(searchParams.get('name') || '');
  const [specialty, setSpecialty] = useState(searchParams.get('specialty') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const buildParams = (page = 1) => {
    const params = { page, limit: 12 };
    if (name.trim()) params.search = name.trim();
    if (specialty) params.specialization = specialty;
    if (location) params.district = location;
    return params;
  };

  const fetchDoctors = async (params) => {
    setLoading(true);
    setSearched(true);
    try {
      const res = await getDoctorsApi(params);
      setDoctors(res.data.doctors ?? []);
      if (res.data.pagination) {
        setPagination(res.data.pagination);
      }
    } catch {
      toast.error('Failed to load doctors.');
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialParams = {};
    if (searchParams.get('name')) initialParams.search = searchParams.get('name');
    if (searchParams.get('specialty')) initialParams.specialization = searchParams.get('specialty');
    if (searchParams.get('location')) initialParams.district = searchParams.get('location');
    if (Object.keys(initialParams).length > 0) {
      fetchDoctors({ ...initialParams, page: 1, limit: 12 });
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const p = {};
    if (name.trim()) p.name = name.trim();
    if (specialty) p.specialty = specialty;
    if (location) p.location = location;
    setSearchParams(p);
    fetchDoctors(buildParams(1));
  };

  const handlePage = (newPage) => {
    fetchDoctors(buildParams(newPage));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Find a Doctor</h1>
        <p className="text-gray-500 mt-1.5">Search verified doctors by name, specialty, or location</p>
      </div>

      {/* Search form */}
      <form onSubmit={handleSearch} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-10">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Search by doctor name…"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="sm:w-52 px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
          >
            <option value="">All Specialties</option>
            {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="sm:w-44 px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
          >
            <option value="">All Locations</option>
            {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
          <button
            type="submit"
            className="bg-teal-600 text-white px-7 py-3 rounded-xl text-sm font-semibold hover:bg-teal-700 active:scale-95 transition-all whitespace-nowrap shadow-sm"
          >
            Search
          </button>
        </div>
      </form>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : searched && doctors.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <SlidersHorizontal size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-semibold text-gray-500">No doctors found</p>
          <p className="text-sm mt-1.5">Try a different name, specialty, or location.</p>
        </div>
      ) : !searched ? (
        <div className="text-center py-24 text-gray-400">
          <Search size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-semibold text-gray-500">Use the filters above to find doctors</p>
          <p className="text-sm mt-1.5">Search by name, specialty, or district.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-5 font-medium">
            {pagination.total} doctor{pagination.total !== 1 ? 's' : ''} found
            {pagination.totalPages > 1 && ` — page ${pagination.page} of ${pagination.totalPages}`}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {doctors.map((doc) => (
              <DoctorCard key={doc.id} doctor={doc} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              <button
                onClick={() => handlePage(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-5 py-2.5 text-sm font-medium border border-gray-200 rounded-xl disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const start = Math.max(1, pagination.page - 2);
                const pageNum = start + i;
                if (pageNum > pagination.totalPages) return null;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePage(pageNum)}
                    className={`w-10 h-10 text-sm font-semibold rounded-xl transition-colors ${
                      pageNum === pagination.page
                        ? 'bg-teal-600 text-white shadow-sm'
                        : 'border border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => handlePage(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
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
