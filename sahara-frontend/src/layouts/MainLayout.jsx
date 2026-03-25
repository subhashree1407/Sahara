import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
};

export default MainLayout;
