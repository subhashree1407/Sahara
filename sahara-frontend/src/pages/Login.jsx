import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password,
            });

            const { token, role } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('role', role);

            switch (role) {
                case 'admin':
                    navigate('/admin');
                    break;
                case 'doctor':
                    navigate('/doctor');
                    break;
                case 'lab':
                    navigate('/lab');
                    break;
                case 'patient':
                    navigate('/patient');
                    break;
                default:
                    navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* global styles — exact Home palette */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
                *{font-family:'Inter',system-ui,sans-serif}
                /* Home uses solid text-teal-600 for "Our Priority", not gradient */
                .hero-blob{position:absolute;border-radius:50%;filter:blur(80px);opacity:.12;pointer-events:none}
                .float{animation:fl 6s ease-in-out infinite}
                @keyframes fl{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
                .float2{animation:fl2 7s ease-in-out infinite}
                @keyframes fl2{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
                .btn-hover{transition:transform .3s cubic-bezier(.22,1,.36,1),box-shadow .3s ease}
                .btn-hover:hover{transform:translateY(-2px)}
                .btn-hover:active{transform:translateY(0)}
                .input-focus{transition:border-color .3s ease,box-shadow .3s ease}
                /* Focus ring matches Home’s subtle teal glow */
                .input-focus:focus{border-color:#5eead4;box-shadow:0 0 0 3px rgba(20,184,166,.10)}
                .card-enter{animation:cardEnter .6s cubic-bezier(.22,1,.36,1) forwards}
                @keyframes cardEnter{0%{opacity:0;transform:translateY(24px)}100%{opacity:1;transform:translateY(0)}}
                .shake{animation:shake .5s cubic-bezier(.36,.07,.19,.97) both}
                @keyframes shake{10%,90%{transform:translateX(-1px)}20%,80%{transform:translateX(2px)}30%,50%,70%{transform:translateX(-4px)}40%,60%{transform:translateX(4px)}}
                .spin{animation:spin 1s linear infinite}
                @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
            `}</style>

            {/* background — exact Home gradient */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        'linear-gradient(135deg,#fafafa 0%,#f8fafc 50%,#f0fdfa 100%)',
                }}
            />

            {/* decorative blobs — exact Home colors & opacity */}
            <div className="hero-blob w-[500px] h-[500px] bg-teal-200 -top-40 -left-40" />
            <div className="hero-blob w-[400px] h-[400px] bg-teal-100 bottom-0 right-0" />
            <div className="hero-blob w-[300px] h-[300px] bg-emerald-100 top-1/2 left-1/3" />
            <div className="hero-blob w-[250px] h-[250px] bg-cyan-100 top-20 right-20" />

            {/* dot pattern overlay — exact Home opacity */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 800 600">
                    <pattern id="dots" width="30" height="30" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1" fill="#0f766e" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#dots)" />
                </svg>
            </div>

            {/* floating decorative elements — exact Home tints */}
            <div className="float absolute top-20 left-10 w-16 h-16 rounded-2xl bg-teal-50/50 border border-teal-100/40 backdrop-blur-sm hidden lg:block" />
            <div className="float2 absolute bottom-32 right-16 w-12 h-12 rounded-xl bg-emerald-50/50 border border-emerald-100/40 backdrop-blur-sm hidden lg:block" />
            <div className="float absolute top-40 right-32 w-10 h-10 rounded-lg bg-cyan-50/50 border border-cyan-100/40 backdrop-blur-sm hidden lg:block" />
            <div className="float2 absolute bottom-20 left-20 w-14 h-14 rounded-2xl bg-slate-50/50 border border-slate-100/40 backdrop-blur-sm hidden lg:block" />

            {/* main content */}
            <div className="relative z-10 w-full max-w-md px-5 sm:px-0 card-enter">
                {/* logo + brand — EXACT Home logo gradient (teal-600 → teal-400) */}
                <div className="text-center mb-7">
                    <button
                        onClick={() => navigate('/')}
                        className="inline-flex items-center gap-2.5 group mb-4"
                    >
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-600 to-teal-400 flex items-center justify-center shadow-lg shadow-teal-400/15 group-hover:shadow-teal-400/30 transition-shadow duration-300">
                            <svg
                                className="w-7 h-6 text-white"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2.5}
                                viewBox="0 0 28 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M2 12h4l3-8 4 16 3-8h4l3 4 3-4h2"
                                />
                            </svg>
                        </div>
                        <span className="text-2xl font-extrabold tracking-tight text-gray-900">
                            Sahara
                        </span>
                    </button>

                    {/* ── tagline: solid text-teal-600 to match Home hero exactly ── */}
                    <h2 className="text-lg font-bold text-gray-800 mb-1">
                        Your Health, <span className="text-teal-600">Our Priority.</span>
                    </h2>
                    <p className="text-sm text-gray-500 font-medium">
                        Sign in to continue
                    </p>
                </div>

                {/* login card */}
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-lg shadow-gray-200/40 border border-gray-100/60 p-8">

                    {error && (
                        <div className="shake mb-5 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <svg
                                    className="w-3 h-3 text-red-500"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2.5}
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </div>
                            <p className="text-sm text-red-600 font-medium">{error}</p>
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={handleLogin}>
                        {/* email */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg
                                        className="w-5 h-5 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={1.5}
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                                        />
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    className="input-focus w-full border border-gray-200 rounded-xl pl-12 pr-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none bg-gray-50/30 hover:bg-gray-50/60 transition-colors duration-200 text-sm"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg
                                        className="w-5 h-5 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={1.5}
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                                        />
                                    </svg>
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="input-focus w-full border border-gray-200 rounded-xl pl-12 pr-12 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none bg-gray-50/30 hover:bg-gray-50/60 transition-colors duration-200 text-sm"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* forgot password link — exact Home link color */}
                        <div className="flex items-center justify-end">
                            <Link
                                to="/forgot-password"
                                className="text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors duration-200"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* submit button — EXACT Home gradient (teal-600 → teal-500) */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-hover w-full py-3.5 text-white font-semibold rounded-full bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 shadow-lg shadow-teal-400/20 hover:shadow-teal-400/30 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:ring-offset-2 transition-all duration-300 text-[15px] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? (
                                <>
                                    <svg
                                        className="spin w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                        />
                                    </svg>
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    {/* divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                            or
                        </span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    {/* register link — exact Home teal link color */}
                    <div className="text-center">
                        <p className="text-sm text-gray-500">
                            Don&apos;t have an account?{' '}
                            <Link
                                to="/register"
                                className="font-semibold text-teal-600 hover:text-teal-700 transition-colors duration-200"
                            >
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>

                {/* trust indicators */}
                <div className="flex items-center justify-center gap-6 mt-7">
                    <div className="flex items-center gap-1.5 text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span className="text-xs font-medium">HIPAA Compliant</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-gray-300" />
                    <div className="flex items-center gap-1.5 text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span className="text-xs font-medium">256-bit SSL</span>
                    </div>
                </div>

                {/* footer */}
                <p className="text-center text-xs text-gray-400 mt-6">
                    © {new Date().getFullYear()} Sahara Healthcare. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default Login;