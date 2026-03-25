import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import docImage from '../assets/doc.jpg';

const Home = () => {
    const navigate = useNavigate();
    const fadeRefs = useRef([]);
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);
    const [activeTestimonial, setActiveTestimonial] = useState(0);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) =>
                entries.forEach((e) => {
                    if (e.isIntersecting) e.target.classList.add('si-visible');
                }),
            { threshold: 0.12 }
        );
        fadeRefs.current.forEach((el) => el && observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const ref = (el) => {
        if (el && !fadeRefs.current.includes(el)) fadeRefs.current.push(el);
    };

    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        setMobileMenu(false);
    };

    useEffect(() => {
        const t = setInterval(
            () => setActiveTestimonial((p) => (p + 1) % testimonials.length),
            5000
        );
        return () => clearInterval(t);
    }, []);

    const navLinks = ['Home', 'About', 'Services', 'Specialties', 'Tips'];

    const stats = [
        { value: '25K+', label: 'Happy Patients' },
        { value: '180+', label: 'Expert Doctors' },
        { value: '45+', label: 'Lab Partners' },
        { value: '99%', label: 'Satisfaction' },
    ];

    const services = [
        {
            title: 'Online Appointments',
            desc: 'Book appointments with top doctors in seconds. Get instant confirmations and smart reminders.',
            icon: (
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
            ),
            color: 'from-teal-400 to-teal-500',
        },
        {
            title: 'Digital Prescriptions',
            desc: 'Receive and store prescriptions digitally. Share with pharmacies with a single tap.',
            icon: (
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
            ),
            color: 'from-emerald-400 to-emerald-500',
        },
        {
            title: 'Lab Integration',
            desc: 'View lab reports in real-time. Seamless sharing between labs, doctors, and patients.',
            icon: (
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
            ),
            color: 'from-cyan-400 to-cyan-500',
        },
        {
            title: '24 / 7 Telemedicine',
            desc: 'Consult doctors from the comfort of your home via secure video calls, any time.',
            icon: (
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
            ),
            color: 'from-amber-400 to-amber-500',
        },
        {
            title: 'Health Records',
            desc: 'Your complete medical history in one secure vault. Access it anywhere, anytime.',
            icon: (
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
            ),
            color: 'from-rose-400 to-rose-500',
        },
        {
            title: 'Emergency Support',
            desc: 'One-tap emergency booking with nearest hospitals. Because every second matters.',
            icon: (
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
            ),
            color: 'from-slate-400 to-slate-500',
        },
    ];

    const specialties = [
        { name: 'Cardiology', img: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&w=600&q=80' },
        { name: 'Neurology', img: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=600&q=80' },
        { name: 'Orthopedics', img: 'https://images.unsplash.com/photo-1579684453423-f84349ef60b0?auto=format&fit=crop&w=600&q=80' },
        { name: 'Pediatrics', img: 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&w=600&q=80' },
        { name: 'Dermatology', img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80' },
        { name: 'Ophthalmology', img: 'https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?auto=format&fit=crop&w=600&q=80' },
    ];

    const tips = [
        { title: 'Stay Hydrated Daily', desc: 'Drink at least 8 glasses of water every day. Proper hydration improves brain function, energy levels, and digestion.', img: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=600&q=80', tag: 'Wellness' },
        { title: '30 Minutes of Exercise', desc: 'Regular physical activity reduces the risk of heart disease, strengthens bones, and boosts mental health.', img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80', tag: 'Fitness' },
        { title: 'Prioritize Sleep', desc: 'Adults need 7-9 hours of quality sleep. Good sleep improves immunity, mood, and cognitive performance.', img: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80', tag: 'Lifestyle' },
        { title: 'Eat a Balanced Diet', desc: 'Include fruits, vegetables, lean proteins, and whole grains. A balanced diet is the foundation of good health.', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80', tag: 'Nutrition' },
    ];

    const testimonials = [
        { text: 'Sahara completely changed how I manage my health. Booking appointments and viewing my lab reports is now effortless. Highly recommended!', name: 'Priya Sharma', role: 'Patient', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80' },
        { text: 'As a physician, Sahara helps me manage my patients seamlessly. Digital prescriptions and integrated lab reports save hours every week.', name: 'Dr. Arjun Reddy', role: 'General Physician', img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=100&q=80' },
        { text: 'The telemedicine feature is a game changer. I consulted a specialist from my village without traveling 200 km. Thank you, Sahara!', name: 'Ramesh Yadav', role: 'Patient', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80' },
    ];

    const footerLinks = {
        Company: ['About Us', 'Careers', 'Press', 'Blog'],
        Services: ['Appointments', 'Telemedicine', 'Lab Reports', 'Prescriptions'],
        Support: ['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Use'],
    };

    return (
        <div className="min-h-screen bg-white font-sans">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
                *{font-family:'Inter',system-ui,sans-serif}
                html{scroll-behavior:smooth}
                .si{opacity:0;transform:translateY(36px);transition:opacity .7s cubic-bezier(.22,1,.36,1),transform .7s cubic-bezier(.22,1,.36,1)}
                .si-visible{opacity:1;transform:translateY(0)}
                .si-d1{transition-delay:.1s}.si-d2{transition-delay:.2s}.si-d3{transition-delay:.3s}.si-d4{transition-delay:.35s}.si-d5{transition-delay:.4s}.si-d6{transition-delay:.5s}
                .grad-text{background:linear-gradient(135deg,#0f766e 0%,#14b8a6 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
                .card-lift{transition:transform .45s cubic-bezier(.22,1,.36,1),box-shadow .45s cubic-bezier(.22,1,.36,1),border-color .35s ease}
                .card-lift:hover{transform:translateY(-10px);box-shadow:0 28px 52px -16px rgba(15,118,110,.13);border-color:rgba(94,234,212,.45)}
                .nav-link{position:relative}
                .nav-link::after{content:'';position:absolute;bottom:2px;left:50%;width:0;height:2px;background:linear-gradient(90deg,#5eead4,#2dd4bf);transition:width .35s cubic-bezier(.22,1,.36,1),left .35s cubic-bezier(.22,1,.36,1);border-radius:2px}
                .nav-link:hover::after{width:55%;left:22.5%}
                .btn-hover{transition:transform .3s cubic-bezier(.22,1,.36,1),box-shadow .3s ease}
                .btn-hover:hover{transform:translateY(-2px)}
                .btn-hover:active{transform:translateY(0)}
                .img-hover{transition:transform .6s cubic-bezier(.22,1,.36,1),filter .4s ease}
                .img-hover:hover{transform:scale(1.07);filter:brightness(1.05)}
            `}</style>

            {/* ════════════ NAVBAR ════════════ */}
            <nav
                className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 bg-white ${scrolled ? 'shadow-[0_2px_24px_rgba(0,0,0,.06)] py-3' : 'py-5'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
                    <button onClick={() => scrollTo('home')} className="flex items-center gap-2.5 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-600 to-teal-400 flex items-center justify-center shadow-lg shadow-teal-400/15 group-hover:shadow-teal-400/30 transition-shadow duration-300">
                            <svg className="w-6 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 28 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2 12h4l3-8 4 16 3-8h4l3 4 3-4h2" />
                            </svg>
                        </div>
                        <span className="text-[22px] font-extrabold tracking-tight text-gray-900">Sahara</span>
                    </button>

                    <div className="hidden lg:flex items-center gap-1">
                        {navLinks.map((l) => (
                            <button
                                key={l}
                                onClick={() => scrollTo(l.toLowerCase())}
                                className="nav-link px-4 py-2 text-[15px] font-semibold text-gray-600 hover:text-teal-600 rounded-lg hover:bg-teal-50/60 transition-colors duration-200"
                            >
                                {l}
                            </button>
                        ))}
                    </div>

                    <div className="hidden lg:flex items-center gap-3">
                        <button
                            onClick={() => navigate('/login')}
                            className="px-5 py-2.5 text-[15px] font-semibold text-gray-700 hover:text-teal-600 transition-colors duration-200"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => navigate('/register')}
                            className="btn-hover px-6 py-2.5 text-[15px] font-semibold text-white bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 rounded-full shadow-lg shadow-teal-400/20 hover:shadow-teal-400/30 transition-all"
                        >
                            Get Started
                        </button>
                    </div>

                    <button className="lg:hidden p-2 text-gray-700" onClick={() => setMobileMenu(!mobileMenu)}>
                        {mobileMenu ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
                            </svg>
                        )}
                    </button>
                </div>

                <div className={`lg:hidden overflow-hidden transition-all duration-300 ${mobileMenu ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="bg-white border-t px-6 py-4 shadow-xl">
                        {navLinks.map((l) => (
                            <button
                                key={l}
                                onClick={() => scrollTo(l.toLowerCase())}
                                className="block w-full text-left py-3 text-gray-600 hover:text-teal-600 font-medium text-[15px] border-b border-gray-100 last:border-0"
                            >
                                {l}
                            </button>
                        ))}
                        <div className="flex gap-3 mt-5">
                            <button onClick={() => navigate('/login')} className="flex-1 py-2.5 border border-gray-200 rounded-full text-[15px] font-semibold text-gray-700">Sign In</button>
                            <button onClick={() => navigate('/register')} className="flex-1 py-2.5 bg-teal-600 rounded-full text-[15px] font-semibold text-white">Get Started</button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* ════════════ HERO ════════════ */}
            <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-white">
                {/* Doctor image — right side */}
                <div className="absolute right-0 top-0 bottom-0 w-[55%] hidden lg:block">
                    <img src={docImage} alt="Doctor" className="h-full w-full object-cover object-center" />
                    <div
                        className="absolute inset-0"
                        style={{
                            background: 'linear-gradient(to right, #ffffff 0%, rgba(255,255,255,0.92) 12%, rgba(255,255,255,0.6) 30%, rgba(255,255,255,0.25) 50%, transparent 70%)',
                        }}
                    />
                </div>

                {/* Mobile background */}
                <div className="absolute inset-0 lg:hidden">
                    <img src={docImage} alt="" className="w-full h-full object-cover opacity-10" />
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-8 pt-28 pb-20">
                    <div ref={ref} className="si max-w-xl">
                        <span className="inline-block text-white text-[11px] font-bold tracking-[0.2em] uppercase px-5 py-2.5 rounded-full bg-gradient-to-r from-teal-600 to-teal-500">
                            Premium Healthcare
                        </span>

                        <h1 className="mt-8 text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-gray-900 leading-[1.1] tracking-tight">
                            Your Health,{' '}
                            <br />
                            <span className="text-teal-600">Our Priority.</span>
                        </h1>

                        <p className="mt-6 text-gray-500 text-lg leading-relaxed max-w-lg">
                            A unified care platform for{' '}
                            <span className="text-gray-700 font-semibold">Patients</span>,{' '}
                            <span className="text-gray-700 font-semibold">Doctors</span>, and{' '}
                            <span className="text-gray-700 font-semibold">Labs</span> — making every step of
                            your medical journey seamless, secure, and stress-free.
                        </p>

                        <div className="flex flex-wrap gap-4 mt-9">
                            <button
                                onClick={() => navigate('/register')}
                                className="btn-hover flex items-center gap-2.5 px-8 py-3.5 text-white font-semibold rounded-full shadow-xl shadow-slate-800/15 hover:shadow-slate-800/25 transition-all text-[15px] bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-900 hover:to-slate-800"
                            >
                                Book Appointment
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </button>
                            <button
                                onClick={() => scrollTo('services')}
                                className="btn-hover px-8 py-3.5 bg-white border border-gray-300 text-gray-700 font-semibold rounded-full hover:border-teal-300 hover:text-teal-600 transition-all text-[15px] shadow-sm"
                            >
                                Explore Services
                            </button>
                        </div>

                        <div className="flex items-center gap-4 mt-10">
                            <div className="flex -space-x-3">
                                {[
                                    'photo-1494790108377-be9c29b29330',
                                    'photo-1507003211169-0a1dd7228f2d',
                                    'photo-1534528741775-53994a69daeb',
                                    'photo-1506794778202-cad84cf45f1d',
                                ].map((id, i) => (
                                    <img
                                        key={i}
                                        src={`https://images.unsplash.com/${id}?auto=format&fit=crop&w=80&q=80`}
                                        alt=""
                                        className="w-10 h-10 rounded-full border-[3px] border-white object-cover"
                                    />
                                ))}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-800">25,000+ Patients</p>
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                    <span className="text-xs text-gray-500 ml-1">4.9 / 5</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ════════════ STATS BAR ════════════ */}
            <section className="relative z-20 px-5 sm:px-8 bg-gray-50 pt-16 pb-8">
                <div
                    ref={ref}
                    className="si max-w-5xl mx-auto bg-white rounded-2xl shadow-xl shadow-gray-200/60 grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100 border border-gray-100"
                >
                    {stats.map((s, i) => (
                        <div key={i} className="py-8 text-center">
                            <p className="text-3xl sm:text-4xl font-extrabold grad-text">{s.value}</p>
                            <p className="text-sm text-gray-500 mt-1 font-medium">{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ════════════ ABOUT ════════════ */}
            <section id="about" className="py-24 px-5 sm:px-8 bg-gray-50">
                <div ref={ref} className="si max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <div className="grid grid-cols-2 gap-4">
                        <img src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=400&q=80" alt="Doctor with patient" className="rounded-2xl shadow-lg h-60 w-full object-cover img-hover" />
                        <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=400&q=80" alt="Medical lab" className="rounded-2xl shadow-lg h-60 w-full object-cover mt-8 img-hover" />
                        <img src="https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&w=400&q=80" alt="Consultation" className="rounded-2xl shadow-lg h-60 w-full object-cover -mt-8 img-hover" />
                        <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=400&q=80" alt="Healthcare team" className="rounded-2xl shadow-lg h-60 w-full object-cover img-hover" />
                    </div>

                    <div>
                        <span className="text-sm font-bold text-teal-600 tracking-widest uppercase">Who We Are</span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3 leading-tight">
                            Redefining Healthcare for the{' '}
                            <span className="grad-text">Digital Age</span>
                        </h2>
                        <p className="text-gray-500 mt-5 leading-relaxed text-[15px]">
                            <span className="font-semibold text-gray-700">Sahara</span> is a comprehensive
                            healthcare platform that connects patients with world-class doctors and
                            accredited diagnostic labs — all under one roof.
                        </p>
                        <p className="text-gray-500 mt-4 leading-relaxed text-[15px]">
                            We believe quality healthcare should be accessible, transparent, and
                            effortless. From booking appointments to receiving digital prescriptions and
                            viewing lab reports, we digitize every touchpoint in your health journey.
                        </p>

                        <div className="grid grid-cols-2 gap-4 mt-8">
                            {[
                                { icon: '🏥', text: 'Multi-specialty Network' },
                                { icon: '🔒', text: 'HIPAA Compliant' },
                                { icon: '⚡', text: 'Instant Appointments' },
                                { icon: '🌍', text: 'Accessible Anywhere' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 bg-white rounded-xl p-3 hover:bg-teal-50/50 transition-colors duration-300 shadow-sm">
                                    <span className="text-xl">{item.icon}</span>
                                    <span className="text-sm font-semibold text-gray-700">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ════════════ SERVICES ════════════ */}
            <section id="services" className="py-24 px-5 sm:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div ref={ref} className="si text-center mb-16">
                        <span className="text-sm font-bold text-teal-600 tracking-widest uppercase">What We Offer</span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3">
                            Services Designed Around <span className="grad-text">You</span>
                        </h2>
                        <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
                            A complete digital healthcare ecosystem that puts patients first and empowers medical professionals.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((s, i) => (
                            <div key={i} ref={ref} className={`si si-d${(i % 6) + 1} bg-gray-50 rounded-2xl p-7 card-lift border border-gray-100 group hover:bg-white`}>
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg mb-5 group-hover:scale-110 transition-transform duration-400`}>
                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">{s.icon}</svg>
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-teal-600 transition-colors duration-300">{s.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════ SPECIALTIES ════════════ */}
            <section id="specialties" className="py-24 px-5 sm:px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div ref={ref} className="si text-center mb-16">
                        <span className="text-sm font-bold text-teal-600 tracking-widest uppercase">Our Specialties</span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3">
                            Treatments &amp; <span className="grad-text">Specialties</span>
                        </h2>
                        <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
                            Our network covers every major medical specialty with experienced professionals.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                        {specialties.map((sp, i) => (
                            <div key={i} ref={ref} className={`si si-d${(i % 6) + 1} group relative rounded-2xl overflow-hidden h-56 card-lift cursor-pointer`}>
                                <img src={sp.img} alt={sp.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent group-hover:from-teal-900/70 group-hover:via-teal-900/20 transition-all duration-500" />
                                <div className="absolute bottom-0 left-0 p-5">
                                    <h3 className="text-white font-bold text-lg">{sp.name}</h3>
                                    <p className="text-white/70 text-xs mt-1 flex items-center gap-1">
                                        Learn more
                                        <svg className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════ WHY CHOOSE US ════════════ */}
            <section className="py-24 px-5 sm:px-8 relative overflow-hidden">
                <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #134e4a 50%, #0f766e 100%)' }} />
                <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 800 600">
                        <pattern id="dots" width="30" height="30" patternUnits="userSpaceOnUse">
                            <circle cx="2" cy="2" r="1.5" fill="white" />
                        </pattern>
                        <rect width="100%" height="100%" fill="url(#dots)" />
                    </svg>
                </div>

                <div ref={ref} className="si relative z-10 max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-sm font-bold text-teal-200 tracking-widest uppercase">Why Sahara</span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">Why Patients Trust Us</h2>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: '🩺', title: 'Verified Doctors', desc: 'Every doctor on our platform is verified and credentialed.' },
                            { icon: '⏱️', title: 'Zero Wait Time', desc: 'Walk-in queues are a thing of the past. Book and arrive on time.' },
                            { icon: '🔐', title: 'Data Privacy', desc: 'Your health data is encrypted and stored on HIPAA-compliant servers.' },
                            { icon: '💰', title: 'Affordable Care', desc: 'Transparent pricing with no hidden fees. Quality care for everyone.' },
                        ].map((item, i) => (
                            <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center hover:bg-white/20 hover:border-white/30 hover:scale-[1.03] transition-all duration-300">
                                <span className="text-4xl">{item.icon}</span>
                                <h3 className="text-white font-bold text-lg mt-4 mb-2">{item.title}</h3>
                                <p className="text-teal-100 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════ HEALTHCARE TIPS ════════════ */}
            <section id="tips" className="py-24 px-5 sm:px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div ref={ref} className="si text-center mb-16">
                        <span className="text-sm font-bold text-teal-600 tracking-widest uppercase">Stay Healthy</span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3">
                            Healthcare <span className="grad-text">Tips & Insights</span>
                        </h2>
                        <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
                            Simple, science-backed tips to help you live a healthier, happier life every day.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {tips.map((tip, i) => (
                            <article key={i} ref={ref} className={`si si-d${i + 1} bg-white rounded-2xl overflow-hidden card-lift border border-gray-100 group`}>
                                <div className="relative h-44 overflow-hidden">
                                    <img src={tip.img} alt={tip.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <span className="absolute top-3 left-3 bg-teal-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">{tip.tag}</span>
                                </div>
                                <div className="p-5">
                                    <h3 className="font-bold text-gray-800 mb-2 group-hover:text-teal-600 transition-colors duration-300">{tip.title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">{tip.desc}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════ TESTIMONIALS ════════════ */}
            <section className="py-24 px-5 sm:px-8 bg-white">
                <div className="max-w-4xl mx-auto">
                    <div ref={ref} className="si text-center mb-16">
                        <span className="text-sm font-bold text-teal-600 tracking-widest uppercase">Testimonials</span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3">
                            What People <span className="grad-text">Say</span>
                        </h2>
                    </div>

                    <div ref={ref} className="si relative">
                        {testimonials.map((t, i) => (
                            <div key={i} className={`transition-all duration-500 ${i === activeTestimonial ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 absolute inset-0'}`}>
                                <div className="bg-gray-50 rounded-3xl shadow-xl p-10 text-center border border-gray-100">
                                    <div className="flex justify-center gap-1 mb-6">
                                        {[...Array(5)].map((_, j) => (
                                            <svg key={j} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <p className="text-gray-600 text-lg leading-relaxed italic max-w-2xl mx-auto">&ldquo;{t.text}&rdquo;</p>
                                    <div className="flex items-center justify-center gap-4 mt-8">
                                        <img src={t.img} alt={t.name} className="w-14 h-14 rounded-full object-cover border-2 border-teal-100" />
                                        <div className="text-left">
                                            <p className="font-bold text-gray-800">{t.name}</p>
                                            <p className="text-sm text-teal-600">{t.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="flex justify-center gap-2 mt-8">
                            {testimonials.map((_, i) => (
                                <button key={i} onClick={() => setActiveTestimonial(i)} className={`h-3 rounded-full transition-all duration-300 ${i === activeTestimonial ? 'bg-teal-600 w-8' : 'bg-gray-300 hover:bg-gray-400 w-3'}`} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ════════════ CTA ════════════ */}
            <section className="py-24 px-5 sm:px-8 bg-gray-50">
                <div ref={ref} className="si max-w-6xl mx-auto relative rounded-3xl overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1400&q=80" alt="Hospital" className="w-full h-[420px] object-cover" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(30,41,59,0.92), rgba(15,118,110,0.6))' }} />
                    <div className="absolute inset-0 flex items-center px-10 sm:px-16">
                        <div className="max-w-lg">
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">Ready to Take Control of Your Health?</h2>
                            <p className="text-teal-100 mt-4 leading-relaxed">
                                Join thousands of patients, doctors, and labs already using Sahara to streamline consultations, prescriptions, and diagnostics.
                            </p>
                            <div className="flex flex-wrap gap-4 mt-8">
                                <button onClick={() => navigate('/register')} className="btn-hover px-8 py-3.5 bg-white text-teal-700 font-bold rounded-full shadow-xl hover:shadow-2xl hover:bg-teal-50 transition-all text-[15px]">Create Free Account</button>
                                <button onClick={() => navigate('/login')} className="btn-hover px-8 py-3.5 border-2 border-white/40 text-white font-semibold rounded-full hover:bg-white/10 hover:border-white/60 transition-all text-[15px]">Sign In →</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ════════════ FOOTER ════════════ */}
            <footer id="contact" className="bg-gray-900 pt-20 pb-8 px-5 sm:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-10 pb-14 border-b border-gray-800">
                        <div className="col-span-2">
                            <div className="flex items-center gap-2.5 mb-5">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-300 flex items-center justify-center">
                                    <svg className="w-6 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 28 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2 12h4l3-8 4 16 3-8h4l3 4 3-4h2" />
                                    </svg>
                                </div>
                                <span className="text-xl font-extrabold text-white">Sahara</span>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                                Your trusted digital healthcare partner. Connecting patients with the best doctors and labs, anytime, anywhere.
                            </p>
                            <div className="flex gap-3 mt-6">
                                {[
                                    'M24 4.557a9.83 9.83 0 01-2.828.775 4.932 4.932 0 002.165-2.724 9.864 9.864 0 01-3.127 1.195A4.916 4.916 0 0016.616 2c-2.722 0-4.927 2.205-4.927 4.927 0 .386.044.762.127 1.124C7.728 7.838 4.1 5.869 1.671 2.898a4.903 4.903 0 00-.667 2.476c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.062c0 2.386 1.697 4.374 3.95 4.827a4.935 4.935 0 01-2.224.085c.627 1.956 2.444 3.379 4.6 3.419A9.868 9.868 0 010 19.54a13.94 13.94 0 007.548 2.212c9.057 0 14.01-7.503 14.01-14.01 0-.213-.005-.425-.014-.636A10.012 10.012 0 0024 4.557z',
                                    'M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z',
                                    'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
                                ].map((d, i) => (
                                    <a key={i} href="#" className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-teal-600 flex items-center justify-center transition-colors duration-300">
                                        <svg className="w-4 h-4 text-gray-400 hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d={d} /></svg>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {Object.entries(footerLinks).map(([heading, links]) => (
                            <div key={heading}>
                                <h4 className="text-white font-bold text-sm mb-4 tracking-wide">{heading}</h4>
                                <ul className="space-y-3">
                                    {links.map((l) => (
                                        <li key={l}><a href="#" className="text-gray-400 hover:text-teal-300 text-sm transition-colors duration-200">{l}</a></li>
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

            {/* back-to-top */}
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className={`fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full text-white shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${scrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
                style={{ background: 'linear-gradient(135deg, #134e4a, #0f766e)' }}
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>
            </button>
        </div>
    );
};

export default Home;