import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API = 'http://localhost:5000/api';

const DoctorDashboard = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const [activeTab, setActiveTab] = useState('appointments');
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [patientReports, setPatientReports] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState('');
    const [scrolled, setScrolled] = useState(false);
    const [prescForm, setPrescForm] = useState({
        patientId: '', reportId: '', diagnosis: '', notes: '',
        medicines: [{ name: '', dosage: '', duration: '', instructions: '' }],
    });

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const fetchAppointments = async () => {
        try {
            const res = await axios.get(`${API}/appointments/my`, { headers });
            setAppointments(res.data);
        } catch { toast.error('Failed to fetch appointments'); }
    };

    const fetchPatients = async () => {
        try {
            const res = await axios.get(`${API}/reports/patients`, { headers });
            setPatients(res.data);
        } catch { toast.error('Failed to fetch patients'); }
    };

    const fetchPrescriptions = async () => {
        try {
            const res = await axios.get(`${API}/prescriptions/doctor`, { headers });
            setPrescriptions(res.data);
        } catch { toast.error('Failed to fetch prescriptions'); }
    };

    const fetchPatientReports = async (patientId) => {
        try {
            const res = await axios.get(`${API}/reports/patient/${patientId}`, { headers });
            setPatientReports(res.data);
        } catch { setPatientReports([]); }
    };

    useEffect(() => {
        fetchAppointments();
        fetchPatients();
        fetchPrescriptions();
    }, []);

    const handlePatientSelect = (id) => {
        setSelectedPatient(id);
        if (id) fetchPatientReports(id);
        else setPatientReports([]);
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await axios.patch(`${API}/appointments/${id}/status`, { status }, { headers });
            toast.success(`Appointment ${status}`);
            fetchAppointments();
        } catch { toast.error('Failed to update'); }
    };

    const addMedicine = () => {
        setPrescForm({ ...prescForm, medicines: [...prescForm.medicines, { name: '', dosage: '', duration: '', instructions: '' }] });
    };

    const removeMedicine = (idx) => {
        const updated = prescForm.medicines.filter((_, i) => i !== idx);
        setPrescForm({ ...prescForm, medicines: updated });
    };

    const updateMedicine = (idx, field, value) => {
        const updated = [...prescForm.medicines];
        updated[idx][field] = value;
        setPrescForm({ ...prescForm, medicines: updated });
    };

    const handleCreatePrescription = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API}/prescriptions`, {
                patientId: prescForm.patientId,
                reportId: prescForm.reportId || undefined,
                diagnosis: prescForm.diagnosis,
                medicines: prescForm.medicines,
                notes: prescForm.notes,
            }, { headers });
            toast.success('Prescription created!');
            setPrescForm({ patientId: '', reportId: '', diagnosis: '', notes: '', medicines: [{ name: '', dosage: '', duration: '', instructions: '' }] });
            fetchPrescriptions();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create prescription');
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

    const navTabs = [
        {
            key: 'appointments', label: 'Appointments', icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
            )
        },
        {
            key: 'reports', label: 'Patient Reports', icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
            )
        },
        {
            key: 'myprescriptions', label: 'My Prescriptions', icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
            )
        },
    ];

    const allTabs = [
        ...navTabs,
        {
            key: 'prescribe', label: 'Write Prescription', icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            )
        },
    ];

    const footerLinks = {
        Platform: ['Dashboard', 'Appointments', 'Prescriptions', 'Reports'],
        Support: ['Help Center', 'Documentation', 'API Reference', 'Contact'],
        Legal: ['Privacy Policy', 'Terms of Service', 'HIPAA Compliance'],
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
                *{font-family:'Inter',system-ui,sans-serif}
                html{scroll-behavior:smooth}
                .card-lift{transition:transform .3s cubic-bezier(.22,1,.36,1),box-shadow .3s ease}
                .card-lift:hover{transform:translateY(-4px);box-shadow:0 20px 40px -12px rgba(15,118,110,.15)}
                .input-field{transition:border-color .3s ease,box-shadow .3s ease,background-color .2s ease}
                .input-field:focus{border-color:#14b8a6;box-shadow:0 0 0 3px rgba(20,184,166,.1)}
            `}</style>

            <ToastContainer position="top-right" autoClose={3000} />

            {/* ════════════ NAVBAR ════════════ */}
            <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-gray-50/95 backdrop-blur-md shadow-lg shadow-gray-200/40 py-3' : 'bg-gray-50 py-4'}`}>
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-600 to-teal-400 flex items-center justify-center shadow-lg shadow-teal-400/15">
                            <svg className="w-6 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 28 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2 12h4l3-8 4 16 3-8h4l3 4 3-4h2" />
                            </svg>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-extrabold tracking-tight text-gray-900">Sahara</span>
                            <span className="hidden sm:inline-block text-[10px] font-bold text-teal-700 px-2 py-0.5 bg-teal-50 border border-teal-200 rounded-full uppercase tracking-wider">Doctor</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden lg:flex items-center gap-2">
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

                            <button
                                onClick={() => setActiveTab('prescribe')}
                                className={`px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${activeTab === 'prescribe'
                                    ? 'text-white bg-gradient-to-r from-teal-600 to-teal-500 shadow-lg shadow-teal-400/25 border border-teal-500'
                                    : 'text-white bg-gradient-to-r from-teal-600 to-teal-500 shadow-md shadow-teal-400/20 hover:shadow-lg hover:shadow-teal-400/30 border border-teal-500'
                                    }`}
                            >
                                <span className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    Write Prescription
                                </span>
                            </button>
                        </div>

                        <div className="h-8 w-px bg-gray-200 hidden lg:block mx-1"></div>

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
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Doctor Dashboard</h1>
                    <p className="text-gray-500">Manage appointments, view patient reports and write prescriptions</p>
                </div>

                {/* ──── Stats Cards ──── */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                    {[
                        { label: 'Appointments', count: appointments.length, icon: '📅', color: 'from-teal-600 to-teal-400', bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-100' },
                        { label: 'Patients', count: patients.length, icon: '👥', color: 'from-emerald-500 to-emerald-400', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100' },
                        { label: 'Prescriptions', count: prescriptions.length, icon: '💊', color: 'from-violet-500 to-violet-400', bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-100' },
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
                                    <span className="text-xs font-medium text-gray-400">Active on platform</span>
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
                                ? t.key === 'prescribe'
                                    ? 'bg-teal-600 text-white shadow-lg shadow-teal-400/25'
                                    : 'bg-teal-100 text-teal-700 border border-teal-200'
                                : t.key === 'prescribe'
                                    ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md shadow-teal-400/20'
                                    : 'bg-white text-gray-600 border border-gray-200'
                                }`}
                        >
                            {t.icon}
                            <span className="whitespace-nowrap">{t.label}</span>
                        </button>
                    ))}
                </div>

                {/* ──── APPOINTMENTS ──── */}
                {activeTab === 'appointments' && (
                    <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Appointments</h2>
                                <p className="text-xs text-gray-400 mt-0.5">Manage your patient appointments</p>
                            </div>
                            <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{appointments.length} total</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
                                    <tr>
                                        <th className="px-6 py-4 text-left">Patient</th>
                                        <th className="px-6 py-4 text-left">Date</th>
                                        <th className="px-6 py-4 text-left">Time</th>
                                        <th className="px-6 py-4 text-left">Reason</th>
                                        <th className="px-6 py-4 text-left">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {appointments.map((a) => (
                                        <tr key={a._id} className="hover:bg-gray-50/80 transition-colors duration-200">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-400 flex items-center justify-center text-sm font-bold text-white">
                                                        {a.patient?.name?.charAt(0)?.toUpperCase() || '?'}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{a.patient?.name}</p>
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
                                            <td className="px-6 py-4 text-gray-500 max-w-[150px] truncate">{a.reason || '—'}</td>
                                            <td className="px-6 py-4">{statusBadge(a.status)}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {a.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleStatusUpdate(a._id, 'confirmed')}
                                                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 rounded-lg hover:bg-teal-100 border border-teal-200 transition-colors duration-200"
                                                            >
                                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                                </svg>
                                                                Confirm
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusUpdate(a._id, 'cancelled')}
                                                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 border border-red-200 transition-colors duration-200"
                                                            >
                                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                                Cancel
                                                            </button>
                                                        </>
                                                    )}
                                                    {a.status === 'confirmed' && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(a._id, 'completed')}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-lg hover:from-emerald-600 hover:to-emerald-500 shadow-sm transition-all duration-200"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            Complete
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {appointments.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-16 text-center">
                                                <div className="flex flex-col items-center justify-center text-gray-400">
                                                    <svg className="w-12 h-12 mb-3 opacity-50" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                                    </svg>
                                                    <p className="text-sm font-medium">No appointments yet</p>
                                                    <p className="text-xs mt-1">Appointments will appear here when patients book</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ──── PATIENT REPORTS ──── */}
                {activeTab === 'reports' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6 max-w-lg card-lift">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-xl">👥</div>
                                <div>
                                    <h3 className="text-base font-bold text-gray-900">Select Patient</h3>
                                    <p className="text-xs text-gray-400">Choose a patient to view their reports</p>
                                </div>
                            </div>
                            <select
                                className="input-field w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none bg-gray-50/50 hover:bg-gray-50 appearance-none"
                                value={selectedPatient}
                                onChange={(e) => handlePatientSelect(e.target.value)}
                            >
                                <option value="">Choose a patient...</option>
                                {patients.map((p) => (
                                    <option key={p._id} value={p._id}>{p.name} ({p.email})</option>
                                ))}
                            </select>
                        </div>

                        {selectedPatient && (
                            <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden">
                                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900">Patient Reports</h2>
                                        <p className="text-xs text-gray-400 mt-0.5">Lab results and medical documents</p>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{patientReports.length} reports</span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
                                            <tr>
                                                <th className="px-6 py-4 text-left">Type</th>
                                                <th className="px-6 py-4 text-left">Uploaded By</th>
                                                <th className="px-6 py-4 text-left">Notes</th>
                                                <th className="px-6 py-4 text-left">Date</th>
                                                <th className="px-6 py-4 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {patientReports.map((r) => (
                                                <tr key={r._id} className="hover:bg-gray-50/80 transition-colors duration-200">
                                                    <td className="px-6 py-4">
                                                        <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-cyan-100 text-cyan-700 border-cyan-200">
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
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                            View
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))}
                                            {patientReports.length === 0 && (
                                                <tr>
                                                    <td colSpan={5} className="px-6 py-16 text-center">
                                                        <div className="flex flex-col items-center justify-center text-gray-400">
                                                            <svg className="w-12 h-12 mb-3 opacity-50" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                                            </svg>
                                                            <p className="text-sm font-medium">No reports for this patient</p>
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
                )}

                {/* ──── WRITE PRESCRIPTION ──── */}
                {activeTab === 'prescribe' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-8 card-lift">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center text-2xl">💊</div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Write Prescription</h3>
                                    <p className="text-sm text-gray-500">Create a new prescription for your patient</p>
                                </div>
                            </div>

                            <form className="space-y-5" onSubmit={handleCreatePrescription}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Patient</label>
                                        <select
                                            className="input-field w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none bg-gray-50/50 hover:bg-gray-50 appearance-none"
                                            value={prescForm.patientId}
                                            onChange={(e) => {
                                                setPrescForm({ ...prescForm, patientId: e.target.value, reportId: '' });
                                                if (e.target.value) fetchPatientReports(e.target.value);
                                            }}
                                            required
                                        >
                                            <option value="">Select Patient</option>
                                            {patients.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Linked Report <span className="text-gray-400 font-normal">(optional)</span></label>
                                        <select
                                            className="input-field w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none bg-gray-50/50 hover:bg-gray-50 appearance-none"
                                            value={prescForm.reportId}
                                            onChange={(e) => setPrescForm({ ...prescForm, reportId: e.target.value })}
                                        >
                                            <option value="">None</option>
                                            {patientReports.map((r) => (
                                                <option key={r._id} value={r._id}>
                                                    {r.reportType} — {new Date(r.createdAt).toLocaleDateString()}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Diagnosis</label>
                                    <input
                                        type="text"
                                        className="input-field w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none bg-gray-50/50 hover:bg-gray-50"
                                        placeholder="e.g. Upper Respiratory Tract Infection"
                                        value={prescForm.diagnosis}
                                        onChange={(e) => setPrescForm({ ...prescForm, diagnosis: e.target.value })}
                                        required
                                    />
                                </div>

                                {/* Medicines */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                            <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                                            </svg>
                                            Medicines
                                        </label>
                                        <button
                                            type="button"
                                            onClick={addMedicine}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 rounded-lg hover:bg-teal-100 border border-teal-200 transition-colors duration-200"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                            </svg>
                                            Add Medicine
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {prescForm.medicines.map((med, idx) => (
                                            <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Medicine {idx + 1}</span>
                                                    {prescForm.medicines.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeMedicine(idx)}
                                                            className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-1.5 rounded-lg transition-colors"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                    <input
                                                        className="input-field border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none bg-white"
                                                        placeholder="Medicine name"
                                                        value={med.name}
                                                        onChange={(e) => updateMedicine(idx, 'name', e.target.value)}
                                                        required
                                                    />
                                                    <input
                                                        className="input-field border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none bg-white"
                                                        placeholder="Dosage"
                                                        value={med.dosage}
                                                        onChange={(e) => updateMedicine(idx, 'dosage', e.target.value)}
                                                        required
                                                    />
                                                    <input
                                                        className="input-field border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none bg-white"
                                                        placeholder="Duration"
                                                        value={med.duration}
                                                        onChange={(e) => updateMedicine(idx, 'duration', e.target.value)}
                                                        required
                                                    />
                                                    <input
                                                        className="input-field border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none bg-white"
                                                        placeholder="Instructions"
                                                        value={med.instructions}
                                                        onChange={(e) => updateMedicine(idx, 'instructions', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Notes <span className="text-gray-400 font-normal">(optional)</span></label>
                                    <textarea
                                        className="input-field w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none bg-gray-50/50 hover:bg-gray-50 resize-none"
                                        rows={3}
                                        placeholder="Additional instructions for the patient..."
                                        value={prescForm.notes}
                                        onChange={(e) => setPrescForm({ ...prescForm, notes: e.target.value })}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3.5 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl mt-2 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 shadow-teal-400/25"
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                                        </svg>
                                        Create Prescription
                                    </span>
                                </button>
                            </form>
                        </div>

                        {/* Side Info */}
                        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-8 card-lift h-fit">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center text-2xl">📝</div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Quick Tips</h3>
                                    <p className="text-sm text-gray-500">Prescription guidelines</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { icon: '✅', title: 'Complete Information', desc: 'Include dosage, duration, and clear instructions' },
                                    { icon: '📋', title: 'Link Reports', desc: 'Attach relevant lab reports for reference' },
                                    { icon: '⚠️', title: 'Allergies', desc: 'Always check patient allergy history first' },
                                    { icon: '📥', title: 'PDF Download', desc: 'Patients can download prescriptions as PDF' },
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

                {/* ──── MY PRESCRIPTIONS ──── */}
                {activeTab === 'myprescriptions' && (
                    <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">My Prescriptions</h2>
                                <p className="text-xs text-gray-400 mt-0.5">All prescriptions you have written</p>
                            </div>
                            <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{prescriptions.length} total</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
                                    <tr>
                                        <th className="px-6 py-4 text-left">Patient</th>
                                        <th className="px-6 py-4 text-left">Diagnosis</th>
                                        <th className="px-6 py-4 text-left">Medicines</th>
                                        <th className="px-6 py-4 text-left">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {prescriptions.map((p) => (
                                        <tr key={p._id} className="hover:bg-gray-50/80 transition-colors duration-200">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-400 flex items-center justify-center text-sm font-bold text-white">
                                                        {p.patient?.name?.charAt(0)?.toUpperCase() || '?'}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{p.patient?.name}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-violet-100 text-violet-700 border-violet-200">
                                                    {p.diagnosis}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {p.medicines.slice(0, 3).map((m, i) => (
                                                        <span key={i} className="px-2 py-0.5 bg-gray-100 rounded-md text-xs font-medium text-gray-600">
                                                            {m.name}
                                                        </span>
                                                    ))}
                                                    {p.medicines.length > 3 && (
                                                        <span className="px-2 py-0.5 bg-teal-50 rounded-md text-xs font-medium text-teal-600">
                                                            +{p.medicines.length - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-400 text-xs">
                                                {new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </td>
                                        </tr>
                                    ))}
                                    {prescriptions.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-16 text-center">
                                                <div className="flex flex-col items-center justify-center text-gray-400">
                                                    <svg className="w-12 h-12 mb-3 opacity-50" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                                    </svg>
                                                    <p className="text-sm font-medium">No prescriptions written yet</p>
                                                    <p className="text-xs mt-1">Start by writing your first prescription</p>
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

export default DoctorDashboard;