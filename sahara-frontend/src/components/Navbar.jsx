import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import logo from '../assets/logo.png';

const Navbar = () => {
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('hero');

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const sections = ['hero', 'about', 'services', 'contact'];
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { threshold: 0.3 }
        );
        sections.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, []);

    const navLinks = [
        { label: 'Home', href: '#hero', id: 'hero' },
        { label: 'About', href: '#about', id: 'about' },
        { label: 'Services', href: '#services', id: 'services' },
        { label: 'Contact', href: '#contact', id: 'contact' },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-white ${
                scrolled ? 'shadow-sm' : ''
            }`}
            style={{ fontFamily: "'Poppins', sans-serif" }}
        >
            <div className="w-full flex items-center px-14 lg:px-24 py-6">
                {/* Logo */}
                <Link to="/" className="flex items-center">
                    <img src={logo} alt="Sahara" className="h-20" />
                </Link>

                {/* Mobile hamburger */}
                <button
                    className="md:hidden p-2 text-gray-600 hover:text-[#5ba3f8] transition ml-auto"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        {mobileOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>

                {/* Desktop links — centered */}
                <ul className="hidden md:flex items-center gap-14 text-base font-semibold text-gray-600 flex-1 justify-center tracking-wide">
                    {navLinks.map((link) => (
                        <li key={link.id}>
                            <a
                                href={link.href}
                                className={`relative hover:text-[#5ba3f8] transition-colors duration-300 pb-1.5 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[3px] after:bg-[#5ba3f8] after:rounded-full after:transition-all after:duration-500 after:ease-in-out ${
                                    activeSection === link.id
                                        ? 'text-[#5ba3f8] after:w-full'
                                        : 'after:w-0'
                                }`}
                            >
                                {link.label}
                            </a>
                        </li>
                    ))}
                    <li>
                        <button onClick={() => navigate('/login')} className="hover:text-[#5ba3f8] transition-colors duration-300">
                            Login
                        </button>
                    </li>
                </ul>

                {/* Register button — right */}
                <div className="hidden md:flex items-center gap-4">
                    {/* Ambulance button */}
                    <button
                        onClick={() => navigate('/ambulance')}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white border-2 border-red-500 text-red-500 hover:bg-red-50 shadow-sm transition duration-200"
                        title="Emergency Ambulance"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6H4a1 1 0 00-1 1v8a1 1 0 001 1h1m8 0h2m0 0h3a1 1 0 001-1v-3.28a1 1 0 00-.316-.734l-3-2.78A1 1 0 0015.37 8H13" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 11h2m-1-1v2" />
                        </svg>
                    </button>
                    <button
                        onClick={() => navigate('/register')}
                        className="px-5 py-2 text-sm bg-[#5ba3f8] text-white rounded-lg hover:bg-[#4a8fe0] transition font-medium"
                    >
                        Register
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden bg-white/95 backdrop-blur border-t border-gray-100 px-14 pb-6">
                    <ul className="flex flex-col gap-5 text-base font-semibold text-gray-600 pt-5">
                        {navLinks.map((link) => (
                            <li key={link.id}>
                                <a
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`hover:text-[#5ba3f8] transition ${
                                        activeSection === link.id ? 'text-[#5ba3f8]' : ''
                                    }`}
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                        <li>
                            <button onClick={() => { navigate('/login'); setMobileOpen(false); }} className="hover:text-[#5ba3f8] transition">
                                Login
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => { navigate('/register'); setMobileOpen(false); }}
                                className="px-6 py-2.5 bg-[#5ba3f8] text-white rounded-lg hover:bg-[#4a8fe0] transition w-full"
                            >
                                Register
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
