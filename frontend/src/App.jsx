import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import JobDetails from './pages/JobDetails';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import CategoryPage from './pages/CategoryPage';
import Contact from './pages/Contact';

function App() {
  const hostname = window.location.hostname;
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
  const isAdminSubdomain = hostname.startsWith('admin.') && !isLocalhost;
  const isAdminMode = import.meta.env.VITE_ADMIN_MODE === 'true';
  
  // Check if we're in admin mode (either subdomain or environment variable)
  const showAdminOnly = isAdminSubdomain || isAdminMode;
  
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Show header/footer only on main site (not admin mode) */}
        {!showAdminOnly && <Header />}
        
        <main className="flex-1">
          <Routes>
            {showAdminOnly ? (
              // Admin mode - only admin routes
              <>
                <Route path="/" element={<AdminLogin />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/*" element={<AdminDashboard />} />
                <Route path="*" element={<AdminLogin />} />
              </>
            ) : (
              // Normal mode - all routes
              <>
                <Route path="/" element={<Home />} />
                <Route path="/job/:id" element={<JobDetails />} />
                <Route path="/category/:category" element={<CategoryPage />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/*" element={<AdminDashboard />} />
                <Route path="*" element={<Home />} />
              </>
            )}
          </Routes>
        </main>
        
        {/* Show footer only on main site (not admin mode) */}
        {!showAdminOnly && <Footer />}
      </div>
    </Router>
  );
}

export default App;