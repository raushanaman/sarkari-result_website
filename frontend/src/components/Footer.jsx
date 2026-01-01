import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import logo from '../Images/Logo.jpeg';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section footer-brand">
            <div className="brand-info">
              <img src={logo} alt="Kasim Cyber World" className="footer-logo" />
              <p className="brand-description">
                Your trusted source for government job notifications, results, and admit cards. 
                Stay updated with the latest opportunities in the public sector.
              </p>
            </div>
          </div>
          
          <div className="footer-section footer-links">
            <h4 className="footer-title">Quick Links</h4>
            <nav className="footer-nav">
              <a href="/category/upcoming-job" className="footer-link">Latest Jobs</a>
              <a href="/category/result" className="footer-link">Results</a>
              <a href="/category/admit-card" className="footer-link">Admit Cards</a>
              <a href="/category/scholarship" className="footer-link">Scholarships</a>
              <a href="/category/admission" className="footer-link">Admissions</a>
            </nav>
          </div>
          
          <div className="footer-section footer-legal">
            <h4 className="footer-title">Legal</h4>
            <nav className="footer-nav">
              <a href="/privacy-policy" className="footer-link">Privacy Policy</a>
              <a href="/disclaimer" className="footer-link">Disclaimer</a>
            </nav>
          </div>
          
          <div className="footer-section footer-contact">
            <h4 className="footer-title">Contact Info</h4>
            <div className="contact-list">
              <div className="contact-item">
                <FaEnvelope className="contact-icon" />
                <span>kcwjobjan2026@gmail.com</span>
              </div>
              <div className="contact-item">
                <FaPhone className="contact-icon" />
                <span>+91 9162911870</span>
              </div>
              <div className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <span>Agrer, Sasaram Bihar</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2026 Kasim Cyber World. All rights reserved.</p>
          <p className="disclaimer-text" style={{fontSize: '12px', marginTop: '8px', color: '#888'}}>
            kcwjobs.com
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;