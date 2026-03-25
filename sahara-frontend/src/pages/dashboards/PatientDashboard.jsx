import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API = 'http://localhost:5000/api';

const PatientDashboard = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const [activeTab, setActiveTab] = useState('reports');
    const [reports, setReports] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [booking, setBooking] = useState(false);
    const [apptForm, setApptForm] = useState({ doctorId: '', date: '', timeSlot: '', reason: '' });
    const [expandedPresc, setExpandedPresc] = useState(null);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const fetchReports = async () => {
        try {
            const res = await axios.get(`${API}/reports/my-reports`, { headers });
            setReports(res.data);
        } catch { toast.error('Failed to fetch reports'); }
    };

    const fetchPrescriptions = async () => {
        try {
            const res = await axios.get(`${API}/prescriptions/patient`, { headers });
            setPrescriptions(res.data);
        } catch { toast.error('Failed to fetch prescriptions'); }
    };

    const fetchAppointments = async () => {
        try {
            const res = await axios.get(`${API}/appointments/my`, { headers });
            setAppointments(res.data);
        } catch { toast.error('Failed to fetch appointments'); }
    };

    const fetchDoctors = async () => {
        try {
            const res = await axios.get(`${API}/appointments/doctors`, { headers });
            setDoctors(res.data);
        } catch { toast.error('Failed to fetch doctors'); }
    };

    useEffect(() => {
        fetchReports();
        fetchPrescriptions();
        fetchAppointments();
        fetchDoctors();
    }, []);

    const handleBookAppointment = async (e) => {
        e.preventDefault();
        setBooking(true);
        try {
            await axios.post(`${API}/appointments`, apptForm, { headers });
            toast.success('Appointment booked successfully!');
            setApptForm({ doctorId: '', date: '', timeSlot: '', reason: '' });
            fetchAppointments();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Booking failed');
        }
        setBooking(false);
    };

    const downloadPdf = async (id) => {
        try {
            const res = await axios.get(`${API}/prescriptions/${id}/pdf`, { headers, responseType: 'blob' });
            const contentDisposition = res.headers['content-disposition'];
            let filename = `prescription_${id}.pdf`;
            if (contentDisposition) {
                const match = contentDisposition.match(/filename="(.+)"/);
                if (match && match[1]) filename = match[1];
            }
            const blob = new Blob([res.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success('PDF downloaded!');
        } catch (err) {
            console.error(err);
            toast.error('Failed to download PDF');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    const statusBadge = (s) => {
        const c = {
            pending: 'bg-amber-100 text-amber-700 border-amber-200',
            confirmed: 'bg-teal-100 text-teal-700 border-teal-200',
            completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
            cancelled: 'bg-rose-100 text-rose-700 border-rose-200',
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${c[s] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                {s?.charAt(0).toUpperCase() + s?.slice(1)}
            </span>
        );
    };

    const timeSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM'];

    // Regular nav tabs (left side of nav)
    const navTabs = [
        {
            key: 'reports', label: 'My Reports', icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
            )
        },
        {
            key: 'prescriptions', label: 'Prescriptions', icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
            )
        },
        {
            key: 'appointments', label: 'Appointments', icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
            )
        },
    ];

    // All tabs for mobile
    const allTabs = [
        ...navTabs,
        {
            key: 'book', label: 'Book Appointment', icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            )
        },
    ];

    const footerLinks = {
        Platform: ['Dashboard', 'Reports', 'Prescriptions', 'Appointments'],
        Support: ['Help Center', 'Documentation', 'API Reference', 'Contact'],
        Legal: ['Privacy Policy', 'Terms of Service', 'HIPAA Compliance'],
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
                *{font-family:'Inter',system-ui,sans-serif}
                html{scroll-behavior:smooth}
                .grad-text{background:linear-gradient(135deg,#0f766e 0%,#14b8a6 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
                .card-lift{transition:transform .3s cubic-bezier(.22,1,.36,1),box-shadow .3s ease}
                .card-lift:hover{transform:translateY(-4px);box-shadow:0 20px 40px -12px rgba(15,118,110,.15)}
                .input-field{transition:border-color .3s ease,box-shadow .3s ease,background-color .2s ease}
                .input-field:focus{border-color:#14b8a6;box-shadow:0 0 0 3px rgba(20,184,166,.1)}
            `}</style>

            <ToastContainer position="top-right" autoClose={3000} />

            {/* ════════════ NAVBAR ════════════ */}
            <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-gray-50/95 backdrop-blur-md shadow-lg shadow-gray-200/40 py-3' : 'bg-gray-50 py-4'}`}>
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-600 to-teal-400 flex items-center justify-center shadow-lg shadow-teal-400/15">
                            <svg className="w-6 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 28 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2 12h4l3-8 4 16 3-8h4l3 4 3-4h2" />
                            </svg>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-extrabold tracking-tight text-gray-900">Sahara</span>
                            <span className="hidden sm:inline-block text-[10px] font-bold text-teal-700 px-2 py-0.5 bg-teal-50 border border-teal-200 rounded-full uppercase tracking-wider">Patient</span>
                        </div>
                    </div>

                    {/* Right side nav items */}
                    <div className="flex items-center gap-3">
                        <div className="hidden lg:flex items-center gap-2">
                            {/* Regular tabs */}
                            {navTabs.map((t) => (
                                <button
                                    key={t.key}
                                    onClick={() => setActiveTab(t.key)}
                                    className={`px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${activeTab === t.key
                                        ? 'text-teal-700 bg-teal-100/80 border border-teal-200'
                                        : 'text-gray-600 hover:text-teal-600 hover:bg-gray-100 border border-transparent'
                                        }`}
                                >
                                    <span className="flex items-center gap-2">
                                        {t.icon}
                                        <span className="hidden xl:inline">{t.label}</span>
                                    </span>
                                </button>
                            ))}

                            {/* Book Appointment — primary action button */}
                            <button
                                onClick={() => setActiveTab('book')}
                                className={`px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${activeTab === 'book'
                                    ? 'text-white bg-gradient-to-r from-teal-600 to-teal-500 shadow-lg shadow-teal-400/25 border border-teal-500'
                                    : 'text-white bg-gradient-to-r from-teal-600 to-teal-500 shadow-md shadow-teal-400/20 hover:shadow-lg hover:shadow-teal-400/30 border border-teal-500'
                                    }`}
                            >
                                <span className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    Book Appointment
                                </span>
                            </button>
                        </div>

                        <div className="h-8 w-px bg-gray-200 hidden lg:block mx-1"></div>

                        {/* Logout */}
                        <button
                            onClick={logout}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 border border-red-100 transition-colors duration-200"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* ════════════ MAIN CONTENT ════════════ */}
            <div className="pt-28 pb-24 max-w-7xl mx-auto px-6 flex-1 w-full min-h-screen">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Patient Dashboard</h1>
                    <p className="text-gray-500">View your health records, prescriptions and manage appointments</p>
                </div>

                {/* ──── Stats Cards ──── */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                    {[
                        { label: 'Medical Reports', count: reports.length, icon: '📋', color: 'from-violet-500 to-violet-400', bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-100' },
                        { label: 'Prescriptions', count: prescriptions.length, icon: '💊', color: 'from-teal-600 to-teal-400', bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-100' },
                        { label: 'Appointments', count: appointments.length, icon: '🗓️', color: 'from-emerald-500 to-emerald-400', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100' },
                    ].map((s) => (
                        <div key={s.label} className={`${s.bg} rounded-2xl p-6 card-lift border ${s.border} relative overflow-hidden`}>
                            <div className={`absolute top-0 right-0 w-28 h-28 bg-gradient-to-br ${s.color} opacity-[0.08] rounded-bl-[60px]`}></div>
                            <div className={`absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr ${s.color} opacity-[0.05] rounded-tr-[40px]`}></div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-3xl">{s.icon}</span>
                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} opacity-20`}></div>
                                </div>
                                <p className="text-sm font-semibold text-gray-500 mb-1">{s.label}</p>
                                <p className={`text-4xl font-extrabold ${s.text}`}>{s.count}</p>
                                <div className="flex items-center gap-1.5 mt-3">
                                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${s.color} animate-pulse`}></div>
                                    <span className="text-xs font-medium text-gray-400">Up to date</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile Tabs */}
                <div className="flex lg:hidden gap-2 mb-6 overflow-x-auto pb-2">
                    {allTabs.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setActiveTab(t.key)}
                            className={`flex-shrink-0 px-4 py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${activeTab === t.key
                                ? t.key === 'book'
                                    ? 'bg-teal-600 text-white shadow-lg shadow-teal-400/25'
                                    : 'bg-teal-100 text-teal-700 border border-teal-200'
                                : t.key === 'book'
                                    ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md shadow-teal-400/20'
                                    : 'bg-white text-gray-600 border border-gray-200'
                                }`}
                        >
                            {t.icon}
                            <span className="whitespace-nowrap">{t.label}</span>
                        </button>
                    ))}
                </div>

                {/* ──── MY REPORTS ──── */}
                {activeTab === 'reports' && (
                    <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">My Reports</h2>
                                <p className="text-xs text-gray-400 mt-0.5">Lab results and medical reports</p>
                            </div>
                            <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{reports.length} reports</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
                                    <tr>
                                        <th className="px-6 py-4 text-left">Report Type</th>
                                        <th className="px-6 py-4 text-left">Uploaded By</th>
                                        <th className="px-6 py-4 text-left">Notes</th>
                                        <th className="px-6 py-4 text-left">Date</th>
                                        <th className="px-6 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {reports.map((r) => (
                                        <tr key={r._id} className="hover:bg-gray-50/80 transition-colors duration-200">
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-violet-100 text-violet-700 border-violet-200">
                                                    {r.reportType}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-400 flex items-center justify-center text-xs font-bold text-white">
                                                        {r.uploadedBy?.name?.charAt(0)?.toUpperCase() || '?'}
                                                    </div>
                                                    <span className="text-gray-700 font-medium">{r.uploadedBy?.name || 'Unknown'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 max-w-[200px] truncate">{r.notes || '—'}</td>
                                            <td className="px-6 py-4 text-gray-400 text-xs">
                                                {new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <a
                                                    href={`http://localhost:5000/uploads/${r.fileUrl}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-teal-700 bg-teal-50 rounded-lg hover:bg-teal-100 border border-teal-200 transition-colors duration-200"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                                    </svg>
                                                    Download
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                    {reports.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-16 text-center">
                                                <div className="flex flex-col items-center justify-center text-gray-400">
                                                    <svg className="w-12 h-12 mb-3 opacity-50" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                                    </svg>
                                                    <p className="text-sm font-medium">No reports available</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ──── MY PRESCRIPTIONS ──── */}
                {activeTab === 'prescriptions' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">My Prescriptions</h2>
                                <p className="text-xs text-gray-400 mt-0.5">Doctor-issued prescriptions and medicines</p>
                            </div>
                            <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{prescriptions.length} prescriptions</span>
                        </div>

                        {prescriptions.length === 0 && (
                            <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-16 text-center">
                                <div className="flex flex-col items-center justify-center text-gray-400">
                                    <svg className="w-12 h-12 mb-3 opacity-50" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                    </svg>
                                    <p className="text-sm font-medium">No prescriptions available</p>
                                </div>
                            </div>
                        )}

                        {prescriptions.map((p) => (
                            <div key={p._id} className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden card-lift">
                                <div
                                    className="flex items-center justify-between px-6 py-5 cursor-pointer hover:bg-gray-50/80 transition-colors duration-200"
                                    onClick={() => setExpandedPresc(expandedPresc === p._id ? null : p._id)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-500 to-teal-400 flex items-center justify-center text-white text-lg font-bold shadow-md shadow-teal-400/20">
                                            💊
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{p.diagnosis}</p>
                                            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-2">
                                                <span className="inline-flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                                    </svg>
                                                    Dr. {p.doctor?.name}
                                                </span>
                                                <span>•</span>
                                                <span>{new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); downloadPdf(p._id); }}
                                            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-teal-600 to-teal-500 rounded-lg hover:from-teal-700 hover:to-teal-600 shadow-md shadow-teal-400/20 transition-all duration-200"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                            </svg>
                                            Download PDF
                                        </button>
                                        <svg className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${expandedPresc === p._id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>

                                {expandedPresc === p._id && (
                                    <div className="px-6 pb-6 border-t border-gray-100 pt-5">
                                        <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                            <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                                            </svg>
                                            Prescribed Medicines
                                        </h4>
                                        <div className="overflow-x-auto rounded-xl border border-gray-100">
                                            <table className="w-full text-sm">
                                                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                                                    <tr>
                                                        <th className="px-5 py-3 text-left">Medicine</th>
                                                        <th className="px-5 py-3 text-left">Dosage</th>
                                                        <th className="px-5 py-3 text-left">Duration</th>
                                                        <th className="px-5 py-3 text-left">Instructions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-50">
                                                    {p.medicines.map((m, i) => (
                                                        <tr key={i} className="hover:bg-gray-50/50 transition-colors duration-200">
                                                            <td className="px-5 py-3">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-2 h-2 rounded-full bg-teal-400"></div>
                                                                    <span className="font-semibold text-gray-900">{m.name}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-5 py-3 text-gray-600">{m.dosage}</td>
                                                            <td className="px-5 py-3 text-gray-600">{m.duration}</td>
                                                            <td className="px-5 py-3 text-gray-500">{m.instructions || '—'}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        {p.notes && (
                                            <div className="mt-4 p-4 bg-teal-50 rounded-xl text-sm text-gray-700 border border-teal-100">
                                                <span className="font-bold text-teal-700">Doctor&apos;s Notes: </span>{p.notes}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* ──── BOOK APPOINTMENT ──── */}
                {activeTab === 'book' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-8 card-lift">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center text-2xl">
                                    📅
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Book an Appointment</h3>
                                    <p className="text-sm text-gray-500">Schedule a visit with your doctor</p>
                                </div>
                            </div>

                            <form className="space-y-4" onSubmit={handleBookAppointment}>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Select Doctor</label>
                                    <select
                                        className="input-field w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none bg-gray-50/50 hover:bg-gray-50 appearance-none"
                                        value={apptForm.doctorId}
                                        onChange={(e) => setApptForm({ ...apptForm, doctorId: e.target.value })}
                                        required
                                    >
                                        <option value="">Choose a doctor...</option>
                                        {doctors.map((d) => (
                                            <option key={d._id} value={d._id}>Dr. {d.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Appointment Date</label>
                                    <input
                                        type="date"
                                        className="input-field w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none bg-gray-50/50 hover:bg-gray-50"
                                        value={apptForm.date}
                                        onChange={(e) => setApptForm({ ...apptForm, date: e.target.value })}
                                        min={new Date().toISOString().split('T')[0]}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Time Slot</label>
                                    <select
                                        className="input-field w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none bg-gray-50/50 hover:bg-gray-50 appearance-none"
                                        value={apptForm.timeSlot}
                                        onChange={(e) => setApptForm({ ...apptForm, timeSlot: e.target.value })}
                                        required
                                    >
                                        <option value="">Select a time...</option>
                                        {timeSlots.map((t) => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Reason <span className="text-gray-400 font-normal">(optional)</span></label>
                                    <textarea
                                        className="input-field w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none bg-gray-50/50 hover:bg-gray-50 resize-none"
                                        rows={3}
                                        placeholder="Describe your symptoms or reason for visit..."
                                        value={apptForm.reason}
                                        onChange={(e) => setApptForm({ ...apptForm, reason: e.target.value })}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={booking}
                                    className="w-full py-3.5 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mt-2 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 shadow-teal-400/25"
                                >
                                    {booking ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            Booking...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                            </svg>
                                            Book Appointment
                                        </span>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Info Card */}
                        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-8 card-lift h-fit">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-2xl">
                                    ℹ️
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Booking Information</h3>
                                    <p className="text-sm text-gray-500">Things to know before your visit</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { icon: '🕐', title: 'Clinic Hours', desc: 'Mon – Fri: 9:00 AM – 5:00 PM' },
                                    { icon: '📞', title: 'Need Help?', desc: 'Call us at +1 (800) 123-4567' },
                                    { icon: '📍', title: 'Location', desc: 'Sahara Healthcare Center, Main Branch' },
                                    { icon: '⚠️', title: 'Cancellation Policy', desc: 'Cancel at least 24 hours in advance' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                                        <span className="text-xl mt-0.5">{item.icon}</span>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ──── MY APPOINTMENTS ──── */}
                {activeTab === 'appointments' && (
                    <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">My Appointments</h2>
                                <p className="text-xs text-gray-400 mt-0.5">Track your upcoming and past appointments</p>
                            </div>
                            <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{appointments.length} total</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
                                    <tr>
                                        <th className="px-6 py-4 text-left">Doctor</th>
                                        <th className="px-6 py-4 text-left">Date</th>
                                        <th className="px-6 py-4 text-left">Time</th>
                                        <th className="px-6 py-4 text-left">Reason</th>
                                        <th className="px-6 py-4 text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {appointments.map((a) => (
                                        <tr key={a._id} className="hover:bg-gray-50/80 transition-colors duration-200">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-400 flex items-center justify-center text-sm font-bold text-white">
                                                        {a.doctor?.name?.charAt(0)?.toUpperCase() || '?'}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">Dr. {a.doctor?.name}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1 text-gray-700 font-medium">
                                                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {a.timeSlot}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 max-w-[200px] truncate">{a.reason || '—'}</td>
                                            <td className="px-6 py-4">{statusBadge(a.status)}</td>
                                        </tr>
                                    ))}
                                    {appointments.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-16 text-center">
                                                <div className="flex flex-col items-center justify-center text-gray-400">
                                                    <svg className="w-12 h-12 mb-3 opacity-50" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                                                    </svg>
                                                    <p className="text-sm font-medium">No appointments yet</p>
                                                    <p className="text-xs mt-1">Book your first appointment to get started</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* ════════════ FOOTER ════════════ */}
            <footer className="bg-gray-900 pt-16 pb-8 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-gray-800">
                        <div className="col-span-1">
                            <div className="flex items-center gap-2.5 mb-5">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-300 flex items-center justify-center">
                                    <svg className="w-6 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 28 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2 12h4l3-8 4 16 3-8h4l3 4 3-4h2" />
                                    </svg>
                                </div>
                                <span className="text-xl font-extrabold text-white">Sahara</span>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                                Your trusted digital healthcare partner. Connecting patients with the best doctors and labs.
                            </p>
                        </div>

                        {Object.entries(footerLinks).map(([heading, links]) => (
                            <div key={heading}>
                                <h4 className="text-white font-bold text-sm mb-4 tracking-wide uppercase">{heading}</h4>
                                <ul className="space-y-3">
                                    {links.map((l) => (
                                        <li key={l}>
                                            <a href="#" className="text-gray-400 hover:text-teal-300 text-sm transition-colors duration-200">{l}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between pt-8 gap-4">
                        <p className="text-gray-500 text-xs">© {new Date().getFullYear()} Sahara Healthcare. All rights reserved.</p>
                        <div className="flex gap-6">
                            {['Privacy Policy', 'Terms of Service', 'Cookie Settings'].map((l) => (
                                <a key={l} href="#" className="text-gray-500 hover:text-gray-300 text-xs transition-colors duration-200">{l}</a>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PatientDashboard;