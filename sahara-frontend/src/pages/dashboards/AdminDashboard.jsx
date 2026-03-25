import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API = 'http://localhost:5000/api';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [scrolled, setScrolled] = useState(false);

    const [doctorForm, setDoctorForm] = useState({ name: '', email: '', password: '' });
    const [labForm, setLabForm] = useState({ name: '', email: '', password: '' });
    const [creating, setCreating] = useState('');

    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${API}/admin/users`, { headers });
            setUsers(res.data);
        } catch {
            toast.error('Failed to fetch users');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreate = async (role) => {
        const form = role === 'doctor' ? doctorForm : labForm;

        if (!form.name || !form.email || !form.password) {
            toast.error('Please fill in all fields');
            return;
        }

        setCreating(role);
        try {
            const endpoint = role === 'doctor' ? 'create-doctor' : 'create-lab';
            await axios.post(`${API}/admin/${endpoint}`, form, { headers });
            toast.success(`${role === 'doctor' ? 'Doctor' : 'Lab Technician'} created successfully!`);

            if (role === 'doctor') {
                setDoctorForm({ name: '', email: '', password: '' });
            } else {
                setLabForm({ name: '', email: '', password: '' });
            }
            fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Creation failed');
        }
        setCreating('');
    };

    const handleDelete = async (id, role) => {
        if (!window.confirm(`Are you sure you want to delete this ${role}?`)) return;
        try {
            await axios.delete(`${API}/admin/users/${id}?role=${role}`, { headers });
            toast.success('User deleted successfully');
            fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Delete failed');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    const stats = {
        patients: users.filter(u => u.role === 'patient').length,
        doctors: users.filter(u => u.role === 'doctor').length,
        labs: users.filter(u => u.role === 'lab').length,
    };

    const roleBadge = (role) => {
        const colors = {
            admin: 'bg-rose-100 text-rose-700 border-rose-200',
            doctor: 'bg-teal-100 text-teal-700 border-teal-200',
            lab: 'bg-cyan-100 text-cyan-700 border-cyan-200',
            patient: 'bg-emerald-100 text-emerald-700 border-emerald-200'
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${colors[role] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
            </span>
        );
    };

    const footerLinks = {
        Platform: ['Dashboard', 'Users', 'Reports', 'Analytics'],
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
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-600 to-teal-400 flex items-center justify-center shadow-lg shadow-teal-400/15">
                            <svg className="w-6 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 28 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2 12h4l3-8 4 16 3-8h4l3 4 3-4h2" />
                            </svg>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-extrabold tracking-tight text-gray-900">Sahara</span>
                            <span className="hidden sm:inline-block text-[10px] font-bold text-teal-700 px-2 py-0.5 bg-teal-50 border border-teal-200 rounded-full uppercase tracking-wider">Admin</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex items-center gap-2">
                            <button
                                onClick={() => setActiveTab('users')}
                                className={`px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${activeTab === 'users'
                                    ? 'text-teal-700 bg-teal-100/80 border border-teal-200'
                                    : 'text-gray-600 hover:text-teal-600 hover:bg-gray-100 border border-transparent'
                                    }`}
                            >
                                <span className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                                    </svg>
                                    All Users
                                </span>
                            </button>
                            <button
                                onClick={() => setActiveTab('create')}
                                className={`px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${activeTab === 'create'
                                    ? 'text-white bg-gradient-to-r from-teal-600 to-teal-500 shadow-lg shadow-teal-400/25 border border-teal-500'
                                    : 'text-white bg-gradient-to-r from-teal-600 to-teal-500 shadow-md shadow-teal-400/20 hover:shadow-lg hover:shadow-teal-400/30 border border-teal-500'
                                    }`}
                            >
                                <span className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    Create User
                                </span>
                            </button>
                        </div>

                        <div className="h-8 w-px bg-gray-200 hidden md:block mx-1"></div>

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
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Admin Dashboard</h1>
                    <p className="text-gray-500">Manage healthcare professionals and monitor platform activity</p>
                </div>

                {/* ──── Stats Cards (original style with gradient corners) ──── */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                    {[
                        { label: 'Total Patients', count: stats.patients, icon: '👥', color: 'from-emerald-500 to-emerald-400', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100' },
                        { label: 'Doctors', count: stats.doctors, icon: '👨‍⚕️', color: 'from-teal-600 to-teal-400', bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-100' },
                        { label: 'Lab Technicians', count: stats.labs, icon: '🔬', color: 'from-cyan-600 to-cyan-400', bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-100' },
                    ].map((s) => (
                        <div key={s.label} className={`${s.bg} rounded-2xl p-6 card-lift border ${s.border} relative overflow-hidden`}>
                            {/* Gradient corner decoration */}
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
                <div className="flex md:hidden gap-2 mb-6">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`flex-1 px-4 py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${activeTab === 'users'
                            ? 'bg-teal-100 text-teal-700 border border-teal-200'
                            : 'bg-white text-gray-600 border border-gray-200'
                            }`}
                    >
                        👥 Users
                    </button>
                    <button
                        onClick={() => setActiveTab('create')}
                        className={`flex-1 px-4 py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${activeTab === 'create'
                            ? 'bg-teal-600 text-white shadow-lg shadow-teal-400/25'
                            : 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md shadow-teal-400/20'
                            }`}
                    >
                        ➕ Create
                    </button>
                </div>

                {/* ──── USERS TAB ──── */}
                {activeTab === 'users' && (
                    <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">All Users</h2>
                                <p className="text-xs text-gray-400 mt-0.5">Complete list of platform users</p>
                            </div>
                            <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{users.length} users</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
                                    <tr>
                                        <th className="px-6 py-4 text-left">User Details</th>
                                        <th className="px-6 py-4 text-left">Email</th>
                                        <th className="px-6 py-4 text-left">Role</th>
                                        <th className="px-6 py-4 text-left">Joined Date</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {users.map((u) => (
                                        <tr key={u._id} className="hover:bg-gray-50/80 transition-colors duration-200">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ${u.role === 'admin' ? 'bg-gradient-to-br from-rose-500 to-rose-400'
                                                        : u.role === 'doctor' ? 'bg-gradient-to-br from-teal-500 to-teal-400'
                                                            : u.role === 'lab' ? 'bg-gradient-to-br from-cyan-500 to-cyan-400'
                                                                : 'bg-gradient-to-br from-emerald-500 to-emerald-400'
                                                        }`}>
                                                        {u.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{u.name}</p>
                                                        <p className="text-xs text-gray-400">ID: {u._id.slice(-6)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">{u.email}</td>
                                            <td className="px-6 py-4">{roleBadge(u.role)}</td>
                                            <td className="px-6 py-4 text-gray-400 text-xs">
                                                {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleDelete(u._id, u.role)}
                                                    className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors inline-flex items-center justify-center disabled:opacity-50"
                                                    title="Delete User"
                                                    disabled={u.role === 'admin' && users.filter(user => user.role === 'admin').length <= 1}
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {users.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-16 text-center">
                                                <div className="flex flex-col items-center justify-center text-gray-400">
                                                    <svg className="w-12 h-12 mb-3 opacity-50" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                                                    </svg>
                                                    <p className="text-sm font-medium">No users found</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ──── CREATE TAB ──── */}
                {activeTab === 'create' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Doctor Form */}
                        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-8 card-lift">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center text-2xl">
                                    👨‍⚕️
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Create Doctor</h3>
                                    <p className="text-sm text-gray-500">Add a new doctor to the platform</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="Dr. John Doe"
                                        className="input-field w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none bg-gray-50/50 hover:bg-gray-50"
                                        value={doctorForm.name}
                                        onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="doctor@hospital.com"
                                        className="input-field w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none bg-gray-50/50 hover:bg-gray-50"
                                        value={doctorForm.email}
                                        onChange={(e) => setDoctorForm({ ...doctorForm, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="input-field w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none bg-gray-50/50 hover:bg-gray-50"
                                        value={doctorForm.password}
                                        onChange={(e) => setDoctorForm({ ...doctorForm, password: e.target.value })}
                                    />
                                </div>
                                <button
                                    onClick={() => handleCreate('doctor')}
                                    disabled={creating === 'doctor'}
                                    className="w-full py-3.5 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mt-2 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 shadow-teal-400/25"
                                >
                                    {creating === 'doctor' ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            Creating...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                            </svg>
                                            Create Doctor
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Lab Technician Form */}
                        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-8 card-lift">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center text-2xl">
                                    🔬
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Create Lab Technician</h3>
                                    <p className="text-sm text-gray-500">Add a new lab tech to the platform</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="Jane Smith"
                                        className="input-field w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none bg-gray-50/50 hover:bg-gray-50"
                                        value={labForm.name}
                                        onChange={(e) => setLabForm({ ...labForm, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="lab@hospital.com"
                                        className="input-field w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none bg-gray-50/50 hover:bg-gray-50"
                                        value={labForm.email}
                                        onChange={(e) => setLabForm({ ...labForm, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="input-field w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none bg-gray-50/50 hover:bg-gray-50"
                                        value={labForm.password}
                                        onChange={(e) => setLabForm({ ...labForm, password: e.target.value })}
                                    />
                                </div>
                                <button
                                    onClick={() => handleCreate('lab')}
                                    disabled={creating === 'lab'}
                                    className="w-full py-3.5 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mt-2 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 shadow-cyan-400/25"
                                >
                                    {creating === 'lab' ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            Creating...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                            </svg>
                                            Create Lab Technician
                                        </span>
                                    )}
                                </button>
                            </div>
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

export default AdminDashboard;