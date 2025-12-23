import { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({ type: 'success', message: data.message });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus({ type: 'error', message: data.message });
      }
    } catch (error) {
      setSubmitStatus({ 
        type: 'error', 
        message: 'Network error. Please check your connection and try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: 'clamp(1.5rem, 4vw, 2rem) 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 6vw, 3rem)' }}>
          <h1 style={{ 
            fontSize: 'clamp(1.8rem, 6vw, 3rem)', 
            fontWeight: 700, 
            color: '#0f172a',
            marginBottom: 'clamp(0.75rem, 2vw, 1rem)'
          }}>
            Contact Us
          </h1>
          <p style={{ 
            fontSize: 'clamp(1rem, 3vw, 1.1rem)', 
            color: '#475569', 
            maxWidth: '600px', 
            margin: '0 auto' 
          }}>
            Have questions about government jobs, results, or admit cards? We're here to help!
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(280px, 40vw, 300px), 1fr))', 
          gap: 'clamp(1.5rem, 4vw, 2rem)',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {/* Contact Info */}
          <div style={{ 
            background: '#ffffff', 
            borderRadius: 'clamp(12px, 3vw, 16px)', 
            padding: 'clamp(1.5rem, 4vw, 2rem)',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
            border: '1px solid rgba(15, 23, 42, 0.05)'
          }}>
            <h2 style={{ 
              fontSize: 'clamp(1.25rem, 4vw, 1.5rem)', 
              fontWeight: 600, 
              color: '#0f172a',
              marginBottom: 'clamp(1rem, 3vw, 1.5rem)'
            }}>
              Get in Touch
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 3vw, 1.5rem)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.75rem, 2vw, 1rem)' }}>
                <div style={{ 
                  background: 'linear-gradient(135deg, #2563eb, #f97316)',
                  color: 'white',
                  padding: 'clamp(0.6rem, 2vw, 0.75rem)',
                  borderRadius: 'clamp(8px, 2vw, 12px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FaEnvelope size={clamp(16, 4, 18)} />
                </div>
                <div>
                  <h3 style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1rem)', fontWeight: 600, color: '#0f172a' }}>Email</h3>
                  <p style={{ color: '#475569', margin: 0, fontSize: 'clamp(0.85rem, 2vw, 0.95rem)' }}>support@kasimcyberworld.com</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  background: 'linear-gradient(135deg, #2563eb, #f97316)',
                  color: 'white',
                  padding: '0.75rem',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FaPhone size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>Phone</h3>
                  <p style={{ color: '#475569', margin: 0 }}>+91 98765 43210</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  background: 'linear-gradient(135deg, #2563eb, #f97316)',
                  color: 'white',
                  padding: '0.75rem',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FaMapMarkerAlt size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>Address</h3>
                  <p style={{ color: '#475569', margin: 0 }}>New Delhi, India</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div style={{ 
            background: '#ffffff', 
            borderRadius: '16px', 
            padding: '2rem',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
            border: '1px solid rgba(15, 23, 42, 0.05)'
          }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 600, 
              color: '#0f172a',
              marginBottom: '1.5rem'
            }}>
              Send Message
            </h2>

            {submitStatus && (
              <div style={{
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                background: submitStatus.type === 'success' ? '#dcfce7' : '#fef2f2',
                color: submitStatus.type === 'success' ? '#166534' : '#dc2626',
                border: `1px solid ${submitStatus.type === 'success' ? '#bbf7d0' : '#fecaca'}`
              }}>
                {submitStatus.message}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'border-color 0.2s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'border-color 0.2s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              <div>
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'border-color 0.2s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              <div>
                <textarea
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'border-color 0.2s ease',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  background: isSubmitting ? '#94a3b8' : 'linear-gradient(135deg, #2563eb, #f97316)',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 10px 25px rgba(37, 99, 235, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <FaPaperPlane size={16} />
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;