import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaGlobe } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer style={{
      background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 50%, #374151 100%)',
      color: '#ffffff',
      padding: '3rem 0',
      marginTop: '4rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at 20% 80%, rgba(147, 197, 253, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(96, 165, 250, 0.1) 0%, transparent 50%)',
        animation: 'footerGlow 8s ease-in-out infinite alternate'
      }}></div>
      
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            animation: 'slideInLeft 1s ease-out'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem'
            }}>
              <FaGlobe size={24} style={{ color: '#93c5fd' }} />
              <h3 style={{ fontSize: '1.25rem', color: '#ffffff', margin: 0 }}>Sarkari Result Portal</h3>
            </div>
            <p style={{ color: '#d1d5db', lineHeight: '1.7' }}>
              Your trusted source for government job notifications, results, and admit cards. 
              Stay updated with the latest opportunities in the public sector.
            </p>
          </div>
          
          <div style={{
            animation: 'slideInUp 1s ease-out 0.2s both'
          }}>
            <h4 style={{ marginBottom: '1rem', color: '#ffffff' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="/category/upcoming-job" style={{ 
                  color: '#d1d5db', 
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                  display: 'inline-block'
                }} onMouseEnter={(e) => e.target.style.color = '#93c5fd'} onMouseLeave={(e) => e.target.style.color = '#d1d5db'}>
                  Latest Jobs
                </a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="/category/result" style={{ 
                  color: '#d1d5db', 
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                  display: 'inline-block'
                }} onMouseEnter={(e) => e.target.style.color = '#93c5fd'} onMouseLeave={(e) => e.target.style.color = '#d1d5db'}>
                  Results
                </a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="/category/admit-card" style={{ 
                  color: '#d1d5db', 
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                  display: 'inline-block'
                }} onMouseEnter={(e) => e.target.style.color = '#93c5fd'} onMouseLeave={(e) => e.target.style.color = '#d1d5db'}>
                  Admit Cards
                </a>
              </li>
            </ul>
          </div>
          
          <div style={{
            animation: 'slideInRight 1s ease-out 0.4s both'
          }}>
            <h4 style={{ marginBottom: '1rem', color: '#ffffff' }}>Contact Info</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaEnvelope size={16} style={{ color: '#93c5fd' }} />
                <span style={{ color: '#d1d5db' }}>info@sarkariresult.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaPhone size={16} style={{ color: '#93c5fd' }} />
                <span style={{ color: '#d1d5db' }}>+91 12345 67890</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaMapMarkerAlt size={16} style={{ color: '#93c5fd' }} />
                <span style={{ color: '#d1d5db' }}>New Delhi, India</span>
              </div>
            </div>
          </div>
        </div>
        
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          paddingTop: '1rem',
          textAlign: 'center',
          color: '#d1d5db',
          animation: 'fadeIn 1s ease-out 0.6s both'
        }}>
          <p>&copy; 2024 Sarkari Result Portal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;