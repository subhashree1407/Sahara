import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API = 'http://localhost:5000/api';

const LabDashboard = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const fileInputRef = useRef(null);

    const [activeTab, setActiveTab] = useState('upload');
    const [patients, setPatients] = useState([]);
    const [reports, setReports] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [form, setForm] = useState({ patientId: '', reportType: '', notes: '' });
    const [file, setFile] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const fetchPatients = async () => {
        try {
            const res = await axios.get(`${API}/reports/patients`, { headers });
            setPatients(res.data);
        } catch {
            toast.error('Failed to fetch patients');
        }
    };

    const fetchMyUploads = async () => {
        try {
            const res = await axios.get(`${API}/reports/my-uploads`, { headers });
            setReports(res.data);
        } catch {
            toast.error('Failed to fetch reports');
        }
    };

    useEffect(() => {
        fetchPatients();
        fetchMyUploads();
    }, []);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) { toast.error('Please select a file'); return; }
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('patientId', form.patientId);
            formData.append('reportType', form.reportType);
            formData.append('notes', form.notes);
            formData.append('reportFile', file);

            await axios.post(`${API}/reports/upload`, formData, {
                headers: { ...headers, 'Content-Type': 'multipart/form-data' },
            });
            toast.success('Report uploaded successfully!');
            setForm({ patientId: '', reportType: '', notes: '' });
            setFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            fetchMyUploads();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Upload failed');
        }
        setUploading(false);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
        else if (e.type === 'dragleave') setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            const allowed = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
            if (allowed.includes(droppedFile.type)) {
                setFile(droppedFile);
            } else {
                toast.error('Only PDF, JPG, and PNG files are allowed');
            }
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    const reportTypes = ['Blood Test', 'X-Ray', 'MRI', 'CT Scan', 'Urine Test', 'ECG', 'Ultrasound', 'Other'];

    const navTabs = [
        {
            key: 'upload',
            label: 'Upload Report',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
            ),
        },
        {
            key: 'reports',
            label: 'My Uploads',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
            ),
        },
    ];

    const footerLinks = {
        Platform: ['Dashboard', 'Upload Reports', 'My Uploads', 'Patient Records'],
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
                            <span className="hidden sm:inline-block text-[10px] font-bold text-teal-700 px-2 py-0.5 bg-teal-50 border border-teal-200 rounded-full uppercase tracking-wider">Lab Tech</span>
                        </div>
                    </div>

                    {/* Right side nav items */}
                    <div className="flex items-center gap-3">
                        <div className="hidden lg:flex items-center gap-2">
                            {navTabs.map((t) => (
                                <button
                                    key={t.key}
                                    onClick={() => setActiveTab(t.key)}
                                    className={`px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${activeTab === t.key
                                        ? t.key === 'upload'
                                            ? 'text-white bg-gradient-to-r from-teal-600 to-teal-500 shadow-lg shadow-teal-400/25 border border-teal-500'
                                            : 'text-teal-700 bg-teal-100/80 border border-teal-200'
                                        : t.key === 'upload'
                                            ? 'text-white bg-gradient-to-r from-teal-600 to-teal-500 shadow-md shadow-teal-400/20 hover:shadow-lg hover:shadow-teal-400/30 border border-teal-500'
                                            : 'text-gray-600 hover:text-teal-600 hover:bg-gray-100 border border-transparent'
                                        }`}
                                >
                                    <span className="flex items-center gap-2">
                                        {t.icon}
                                        <span className="hidden xl:inline">{t.label}</span>
                                    </span>
                                </button>
                            ))}
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
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Lab Technician Dashboard</h1>
                    <p className="text-gray-500">Upload medical reports and manage patient records</p>
                </div>

                {/* ──── Stats Cards ──── */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                    {[
                        { label: 'Total Uploads', count: reports.length, icon: '📋', color: 'from-violet-500 to-violet-400', bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-100' },
                        { label: 'Patients', count: patients.length, icon: '👥', color: 'from-teal-600 to-teal-400', bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-100' },
                        {
                            label: 'Report Types',
                            count: [...new Set(reports.map((r) => r.reportType))].length,
                            icon: '🧪',
                            color: 'from-emerald-500 to-emerald-400',
                            bg: 'bg-emerald-50',
                            text: 'text-emerald-700',
                            border: 'border-emerald-100',
                        },
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
                    {navTabs.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setActiveTab(t.key)}
                            className={`flex-shrink-0 px-4 py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${activeTab === t.key
                                ? t.key === 'upload'
                                    ? 'bg-teal-600 text-white shadow-lg shadow-teal-400/25'
                                    : 'bg-teal-100 text-teal-700 border border-teal-200'
                                : t.key === 'upload'
                                    ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md shadow-teal-400/20'
                                    : 'bg-white text-gray-600 border border-gray-200'
                                }`}
                        >
                            {t.icon}
                            <span className="whitespace-nowrap">{t.label}</span>
                        </button>
                    ))}
                </div>

                {/* ──── UPLOAD REPORT ──── */}
                {activeTab === 'upload' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-8 card-lift">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center text-2xl">
                                    📤
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Upload Medical Report</h3>
                                    <p className="text-sm text-gray-500">Submit lab results for a patient</p>
                                </div>
                            </div>

                            <form className="space-y-4" onSubmit={handleUpload}>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Select Patient</label>
                                    <select
                                        className="input-field w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none bg-gray-50/50 hover:bg-gray-50 appearance-none"
                                        value={form.patientId}
                                        onChange={(e) => setForm({ ...form, patientId: e.target.value })}
                                        required
                                    >
                                        <option value="">Choose a patient...</option>
                                        {patients.map((p) => (
                                            <option key={p._id} value={p._id}>{p.name} ({p.email})</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Report Type</label>
                                    <select
                                        className="input-field w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none bg-gray-50/50 hover:bg-gray-50 appearance-none"
                                        value={form.reportType}
                                        onChange={(e) => setForm({ ...form, reportType: e.target.value })}
                                        required
                                    >
                                        <option value="">Select report type...</option>
                                        {reportTypes.map((t) => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Drag & Drop File Upload */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Report File</label>
                                    <div
                                        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 cursor-pointer ${dragActive
                                            ? 'border-teal-400 bg-teal-50/50'
                                            : file
                                                ? 'border-teal-300 bg-teal-50/30'
                                                : 'border-gray-200 bg-gray-50/50 hover:border-teal-300 hover:bg-gray-50'
                                            }`}
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            className="hidden"
                                            onChange={(e) => setFile(e.target.files[0])}
                                        />

                                        {file ? (
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
                                                    <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <p className="text-sm font-semibold text-gray-900">{file.name}</p>
                                                <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setFile(null);
                                                        if (fileInputRef.current) fileInputRef.current.value = '';
                                                    }}
                                                    className="text-xs text-red-500 hover:text-red-700 font-medium mt-1"
                                                >
                                                    Remove file
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                                    </svg>
                                                </div>
                                                <p className="text-sm font-medium text-gray-600">
                                                    <span className="text-teal-600 font-semibold">Click to upload</span> or drag and drop
                                                </p>
                                                <p className="text-xs text-gray-400">PDF, JPG, or PNG (max 10MB)</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Notes <span className="text-gray-400 font-normal">(optional)</span></label>
                                    <textarea
                                        className="input-field w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none bg-gray-50/50 hover:bg-gray-50 resize-none"
                                        rows={3}
                                        placeholder="Additional notes about the report..."
                                        value={form.notes}
                                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="w-full py-3.5 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mt-2 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 shadow-teal-400/25"
                                >
                                    {uploading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            Uploading...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                            </svg>
                                            Upload Report
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
                                    <h3 className="text-xl font-bold text-gray-900">Upload Guidelines</h3>
                                    <p className="text-sm text-gray-500">Important information for uploading</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { icon: '📄', title: 'Accepted Formats', desc: 'PDF, JPG, JPEG, and PNG files' },
                                    { icon: '📏', title: 'File Size Limit', desc: 'Maximum file size is 10MB' },
                                    { icon: '🔒', title: 'Data Security', desc: 'All reports are encrypted and HIPAA compliant' },
                                    { icon: '👤', title: 'Patient Verification', desc: 'Ensure patient details match before uploading' },
                                    { icon: '📝', title: 'Notes', desc: 'Add relevant notes for doctor reference' },
                                    { icon: '⚡', title: 'Processing', desc: 'Reports are available to patients instantly' },
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

                {/* ──── MY UPLOADS ──── */}
                {activeTab === 'reports' && (
                    <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">My Uploads</h2>
                                <p className="text-xs text-gray-400 mt-0.5">All reports uploaded by you</p>
                            </div>
                            <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{reports.length} reports</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
                                    <tr>
                                        <th className="px-6 py-4 text-left">Patient</th>
                                        <th className="px-6 py-4 text-left">Report Type</th>
                                        <th className="px-6 py-4 text-left">Notes</th>
                                        <th className="px-6 py-4 text-left">Date</th>
                                        <th className="px-6 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {reports.map((r) => (
                                        <tr key={r._id} className="hover:bg-gray-50/80 transition-colors duration-200">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-teal-400 flex items-center justify-center text-xs font-bold text-white">
                                                        {r.patient?.name?.charAt(0)?.toUpperCase() || '?'}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{r.patient?.name || 'Unknown'}</p>
                                                        <p className="text-xs text-gray-400">{r.patient?.email || ''}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-violet-100 text-violet-700 border-violet-200">
                                                    {r.reportType}
                                                </span>
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
                                                    <p className="text-sm font-medium">No reports uploaded yet</p>
                                                    <p className="text-xs mt-1">Upload your first report to get started</p>
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

export default LabDashboard;