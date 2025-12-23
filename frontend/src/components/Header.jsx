import { Link } from 'react-router-dom';
import { FaHome, FaBriefcase, FaFileAlt, FaGraduationCap, FaSearch, FaTimes } from 'react-icons/fa';
import logo from '../Images/logo.jpeg';
import { useState } from 'react';

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navLinkStyle = {
    color: 'white',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.45rem 0.75rem',
    borderRadius: '8px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontWeight: 500,
    fontSize: '0.95rem',
    position: 'relative',
    overflow: 'hidden'
  };

  const handleHover = (event, isEntering) => {
    if (isEntering) {
      event.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
      event.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
      event.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)';
    } else {
      event.currentTarget.style.background = 'transparent';
      event.currentTarget.style.transform = 'translateY(0) scale(1)';
      event.currentTarget.style.boxShadow = 'none';
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
            50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.8), 0 0 40px rgba(59, 130, 246, 0.6); }
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
      
      <header className="header-animated" style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 30%, #1e40af 60%, #2563eb 100%)',
        color: 'white',
        padding: '0.5rem 0',
        boxShadow: '0 8px 32px rgba(30, 58, 138, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 999,
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Link to="/" className="logo-glow" style={{
              fontSize: '1.6rem',
              fontWeight: 'bold',
              color: 'white',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.25rem 0.5rem',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease'
            }}>
              <img
                src={logo}
                alt="Sarkari Result"
                style={{
                  height: '36px',
                  width: 'auto',
                  borderRadius: '8px'
                }}
              />
            </Link>
            
            <nav style={{
              display: 'flex',
              gap: '0.25rem',
              alignItems: 'center'
            }}>
              <Link
                to="/"
                className="nav-item"
                style={navLinkStyle}
                onMouseEnter={(event) => handleHover(event, true)}
                onMouseLeave={(event) => handleHover(event, false)}
              >
                <FaHome size={16} />
                Home
              </Link>
              
              <Link
                to="/jobs"
                className="nav-item"
                style={navLinkStyle}
                onMouseEnter={(event) => handleHover(event, true)}
                onMouseLeave={(event) => handleHover(event, false)}
              >
                <FaBriefcase size={16} />
                Latest Job
              </Link>
              
              <Link
                to="/admit-cards"
                className="nav-item"
                style={navLinkStyle}
                onMouseEnter={(event) => handleHover(event, true)}
                onMouseLeave={(event) => handleHover(event, false)}
              >
                <FaFileAlt size={16} />
                Admit Card
              </Link>
              
              <Link
                to="/results"
                className="nav-item"
                style={navLinkStyle}
                onMouseEnter={(event) => handleHover(event, true)}
                onMouseLeave={(event) => handleHover(event, false)}
              >
                <FaGraduationCap size={16} />
                Result
              </Link>
              

              
              <div style={{
                marginLeft: '0.75rem',
                padding: '0.5rem',
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(5px)'
              }}
              onClick={() => setIsSearchOpen(true)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.transform = 'scale(1)';
              }}>
                <FaSearch size={18} />
              </div>
            </nav>
          </div>
        </div>
        
        {/* Search Modal */}
        {isSearchOpen && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '2rem',
              width: '90%',
              maxWidth: '500px',
              position: 'relative'
            }}>
              <button
                onClick={() => setIsSearchOpen(false)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                <FaTimes />
              </button>
              
              <h3 style={{
                marginBottom: '1.5rem',
                color: '#333',
                textAlign: 'center'
              }}>
                Search Jobs, Results & Admit Cards
              </h3>
              
              <input
                type="text"
                placeholder="Search for jobs, results, admit cards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '1rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  marginBottom: '1rem',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '0.75rem',
                marginBottom: '1.5rem'
              }}>
                <button
                  onClick={() => {
                    setSearchQuery('RRB');
                  }}
                  style={{
                    padding: '0.75rem',
                    background: '#f3f4f6',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  RRB Jobs
                </button>
                <button
                  onClick={() => {
                    setSearchQuery('SSC');
                  }}
                  style={{
                    padding: '0.75rem',
                    background: '#f3f4f6',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  SSC Results
                </button>
                <button
                  onClick={() => {
                    setSearchQuery('UPSC');
                  }}
                  style={{
                    padding: '0.75rem',
                    background: '#f3f4f6',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  UPSC
                </button>
                <button
                  onClick={() => {
                    setSearchQuery('Admit Card');
                  }}
                  style={{
                    padding: '0.75rem',
                    background: '#f3f4f6',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  Admit Cards
                </button>
              </div>
              
              <button
                onClick={() => {
                  if (searchQuery.trim()) {
                    // Perform search logic here
                    console.log('Searching for:', searchQuery);
                    setIsSearchOpen(false);
                  }
                }}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Search
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;