import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBriefcase, FaFileAlt, FaGraduationCap, FaMoon, FaSun } from 'react-icons/fa';
import logo from '../Images/Logo.jpeg';
import { useState, useEffect } from 'react';

const Header = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const location = useLocation();
  const isAdminPage = location.pathname.includes('/admin');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkTheme(true);
      document.body.classList.add('dark-theme');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    
    if (newTheme) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  };

  const navLinkStyle = {
    color: 'var(--header-text)',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(0.3rem, 1vw, 0.5rem)',
    padding: 'clamp(0.3rem, 1.5vw, 0.45rem) clamp(0.5rem, 2vw, 0.75rem)',
    borderRadius: '8px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontWeight: 500,
    fontSize: 'clamp(0.8rem, 2.5vw, 0.95rem)',
    position: 'relative',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    background: 'transparent'
  };

  const handleHover = (event, isEntering) => {
    if (isEntering) {
      event.currentTarget.style.background = 'var(--header-hover-bg)';
      event.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
    } else {
      event.currentTarget.style.background = 'transparent';
      event.currentTarget.style.transform = 'translateY(0) scale(1)';
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 20px rgba(239, 242, 248, 0.5); }
            50% { box-shadow: 0 0 30px rgba(245, 246, 247, 0.8), 0 0 40px rgba(59, 130, 246, 0.6); }
          }
          
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .header-animated {
            animation: slideIn 0.6s ease-out;
          }
          
          .logo-glow {
            animation: glow 3s ease-in-out infinite;
          }
          
          .nav-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
          }
          
          .nav-item:hover::before {
            left: 100%;
          }
          
          .dropdown {
            position: absolute;
            top: 100%;
            right: 0;
            background: rgba(30, 58, 138, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 12px;
            padding: 1rem;
            min-width: 200px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            opacity: 0;
            visibility: hidden;
            transform: translateY(-10px);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .dropdown.open {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
          }
        `}
      </style>
      
      <header className="header-animated site-header" style={{
        color: 'var(--header-text)',
        padding: 'clamp(0.5rem, 2vw, 1rem) 0',
        position: 'sticky',
        top: 0,
        zIndex: 999
      }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 'clamp(0.5rem, 2vw, 1rem)'
          }}>
            <Link 
              to="/" 
              className="logo-glow" 
              target={isAdminPage ? "_blank" : "_self"}
              rel={isAdminPage ? "noopener noreferrer" : undefined}
              style={{
                fontSize: 'clamp(1.2rem, 4vw, 1.6rem)',
                fontWeight: 'bold',
                color: 'var(--header-text)',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 'clamp(0.4rem, 1.5vw, 0.6rem)',
                padding: 'clamp(0.2rem, 1vw, 0.25rem) clamp(0.4rem, 1.5vw, 0.5rem)',
                borderRadius: '12px',
                background: 'var(--header-pill-bg)',
                transition: 'all 0.3s ease'
              }}>
              <img
                src={logo}
                alt="Sarkari Result"
                style={{
                  height: 'clamp(28px, 6vw, 36px)',
                  width: 'auto',
                  borderRadius: '8px'
                }}
              />
            </Link>
            
            <nav style={{
              display: 'flex',
              gap: 'clamp(0.1rem, 1vw, 0.25rem)',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              <Link
                to="/"
                className="nav-item"
                target={isAdminPage ? "_blank" : "_self"}
                rel={isAdminPage ? "noopener noreferrer" : undefined}
                style={navLinkStyle}
                onMouseEnter={(event) => handleHover(event, true)}
                onMouseLeave={(event) => handleHover(event, false)}
              >
                <FaHome size={16} />
                Home
              </Link>
              
              <Link
                to="/category/upcoming-job"
                className="nav-item"
                target={isAdminPage ? "_blank" : "_self"}
                rel={isAdminPage ? "noopener noreferrer" : undefined}
                style={navLinkStyle}
                onMouseEnter={(event) => handleHover(event, true)}
                onMouseLeave={(event) => handleHover(event, false)}
              >
                <FaBriefcase size={16} />
                Latest Job
              </Link>
              
              <Link
                to="/category/admit-card"
                className="nav-item"
                target={isAdminPage ? "_blank" : "_self"}
                rel={isAdminPage ? "noopener noreferrer" : undefined}
                style={navLinkStyle}
                onMouseEnter={(event) => handleHover(event, true)}
                onMouseLeave={(event) => handleHover(event, false)}
              >
                <FaFileAlt size={16} />
                Admit Card
              </Link>
              
              <Link
                to="/category/result"
                className="nav-item"
                target={isAdminPage ? "_blank" : "_self"}
                rel={isAdminPage ? "noopener noreferrer" : undefined}
                style={navLinkStyle}
                onMouseEnter={(event) => handleHover(event, true)}
                onMouseLeave={(event) => handleHover(event, false)}
              >
                <FaGraduationCap size={16} />
                Result
              </Link>
              
              <Link
                to="/category/scholarship"
                className="nav-item"
                target={isAdminPage ? "_blank" : "_self"}
                rel={isAdminPage ? "noopener noreferrer" : undefined}
                style={navLinkStyle}
                onMouseEnter={(event) => handleHover(event, true)}
                onMouseLeave={(event) => handleHover(event, false)}
              >
                <FaGraduationCap size={16} />
                Scholarship
              </Link>
              
              <Link
                to="/category/admission"
                className="nav-item"
                target={isAdminPage ? "_blank" : "_self"}
                rel={isAdminPage ? "noopener noreferrer" : undefined}
                style={navLinkStyle}
                onMouseEnter={(event) => handleHover(event, true)}
                onMouseLeave={(event) => handleHover(event, false)}
              >
                <FaFileAlt size={16} />
                Admission
              </Link>
              
              <button
                onClick={toggleTheme}
                style={{
                  ...navLinkStyle,
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onMouseEnter={(event) => handleHover(event, true)}
                onMouseLeave={(event) => handleHover(event, false)}
                title={isDarkTheme ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              >
                {isDarkTheme ? <FaSun size={16} /> : <FaMoon size={16} />}
                {isDarkTheme ? 'Light' : 'Dark'}
              </button>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;