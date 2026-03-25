import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API = 'http://localhost:5000/api';

const LabDashboard = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const [activeTab, setActiveTab] = useState('upload');
    const [patients, setPatients] = useState([]);
    const [reports, setReports] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [form, setForm] = useState({ patientId: '', reportType: '', notes: '' });
    const [file, setFile] = useState(null);

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
            fetchMyUploads();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Upload failed');
        }
        setUploading(false);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Top bar */}
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Lab Technician Dashboard</h1>
                    <p className="text-xs text-gray-400">Sahara Healthcare — Report Management</p>
                </div>
                <button onClick={logout} className="px-4 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium">
                    Logout
                </button>
            </header>

            <div className="max-w-5xl mx-auto px-6 py-8">
                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    {[{ key: 'upload', label: '📤 Upload Report' }, { key: 'reports', label: '📋 My Uploads' }].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-5 py-2 rounded-lg text-sm font-medium transition ${activeTab === tab.key ? 'bg-purple-600 text-white shadow' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === 'upload' && (
                    <div className="bg-white rounded-xl shadow-sm p-8 max-w-lg">
                        <h3 className="text-lg font-semibold text-gray-800 mb-5">Upload Medical Report</h3>
                        <form className="space-y-4" onSubmit={handleUpload}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
                                <select
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                                    value={form.patientId}
                                    onChange={(e) => setForm({ ...form, patientId: e.target.value })}
                                    required
                                >
                                    <option value="">Select Patient</option>
                                    {patients.map((p) => (
                                        <option key={p._id} value={p._id}>{p.name} ({p.email})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
                                <select
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                                    value={form.reportType}
                                    onChange={(e) => setForm({ ...form, reportType: e.target.value })}
                                    required
                                >
                                    <option value="">Select Type</option>
                                    <option value="Blood Test">Blood Test</option>
                                    <option value="X-Ray">X-Ray</option>
                                    <option value="MRI">MRI</option>
                                    <option value="CT Scan">CT Scan</option>
                                    <option value="Urine Test">Urine Test</option>
                                    <option value="ECG">ECG</option>
                                    <option value="Ultrasound">Ultrasound</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Report File (PDF, JPG, PNG)</label>
                                <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                                    onChange={(e) => setFile(e.target.files[0])}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                                <textarea
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                    rows={3}
                                    placeholder="Additional notes..."
                                    value={form.notes}
                                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={uploading}
                                className="w-full py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
                            >
                                {uploading ? 'Uploading...' : 'Upload Report'}
                            </button>
                        </form>
                    </div>
                )}

                {activeTab === 'reports' && (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3 text-left">Patient</th>
                                    <th className="px-6 py-3 text-left">Report Type</th>
                                    <th className="px-6 py-3 text-left">Notes</th>
                                    <th className="px-6 py-3 text-left">Date</th>
                                    <th className="px-6 py-3 text-left">File</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {reports.map((r) => (
                                    <tr key={r._id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-medium text-gray-800">{r.patient?.name}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">{r.reportType}</span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 max-w-[200px] truncate">{r.notes || '—'}</td>
                                        <td className="px-6 py-4 text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <a href={`http://localhost:5000/uploads/${r.fileUrl}`} target="_blank" rel="noreferrer" className="text-purple-600 hover:underline text-sm font-medium">
                                                Download
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                                {reports.length === 0 && (
                                    <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">No reports uploaded yet</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LabDashboard;
