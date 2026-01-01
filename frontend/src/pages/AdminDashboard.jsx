import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsAPI, youtubeAPI } from '../services/api';
import { FaPlus, FaEdit, FaTrash, FaSignOutAlt, FaEye, FaTimes, FaExclamationTriangle, FaClock, FaCheck, FaYoutube } from 'react-icons/fa';
import { CATEGORY_SECTION_CONFIG, ensureSectionDefaults } from '../constants/categorySections';

const AdminDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [deletionNotifications, setDeletionNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDeletionModal, setShowDeletionModal] = useState(false);
  const [showYouTubeForm, setShowYouTubeForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [notification, setNotification] = useState('');
  const [selectedJobsForDeletion, setSelectedJobsForDeletion] = useState([]);
  const [youtubeData, setYoutubeData] = useState({
    channelUrl: ''
  });
  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    category: 'upcoming-job',
    description: '',
    lastDate: '',
    startDate: '',
    applicationFee: '',
    applyLink: '',
    organizationLink: '',
    shortNoticeLink: '',
    syllabusLink: '',
    youtubeLink: '',
    eligibility: '',
    salary: '',
    posts: '',
    details: ensureSectionDefaults('upcoming-job')
  });
  const navigate = useNavigate();
  
  // Check if dark theme is active
  const isDarkTheme = document.body.classList.contains('dark-theme');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchJobs();
    fetchDeletionNotifications();
    fetchYouTubeData();
  }, [navigate]);

  useEffect(() => {
    if (showForm) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showForm]);

  const fetchJobs = async () => {
    try {
      const response = await jobsAPI.getAdminJobs();
      const jobsData = response.data.data || [];
      setJobs(jobsData);
      setFilteredJobs(jobsData); // Initially show all jobs
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
      setFilteredJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDeletionNotifications = async () => {
    try {
      const response = await jobsAPI.getDeletionNotifications();
      setDeletionNotifications(response.data.data || []);
    } catch (error) {
      console.error('Error fetching deletion notifications:', error);
    }
  };

  const fetchYouTubeData = async () => {
    try {
      const response = await youtubeAPI.getYouTubeUpdate();
      if (response.data.success && response.data.data) {
        setYoutubeData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching YouTube data:', error);
    }
  };

  const handleConfirmDeletion = async () => {
    try {
      await jobsAPI.confirmDeletion(selectedJobsForDeletion);
      setNotification('✅ Selected jobs deleted successfully!');
      fetchJobs();
      fetchDeletionNotifications();
      setShowDeletionModal(false);
      setSelectedJobsForDeletion([]);
      setTimeout(() => setNotification(''), 5000);
    } catch (error) {
      console.error('Error confirming deletion:', error);
      setNotification('❌ Error deleting jobs. Please try again.');
      setTimeout(() => setNotification(''), 5000);
    }
  };

  const handlePostponeDeletion = async (days = 7) => {
    try {
      await jobsAPI.postponeDeletion(selectedJobsForDeletion, days);
      setNotification(`✅ Deletion postponed for ${days} days!`);
      fetchDeletionNotifications();
      setShowDeletionModal(false);
      setSelectedJobsForDeletion([]);
      setTimeout(() => setNotification(''), 5000);
    } catch (error) {
      console.error('Error postponing deletion:', error);
      setNotification('❌ Error postponing deletion. Please try again.');
      setTimeout(() => setNotification(''), 5000);
    }
  };

  const getDaysUntilDeletion = (deletionDate) => {
    const now = new Date();
    const deletion = new Date(deletionDate);
    const diffTime = deletion - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    if (filter === 'all') {
      setFilteredJobs(jobs);
    } else {
      setFilteredJobs(jobs.filter(job => job.category === filter));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category') {
      setFormData((prev) => ({
        ...prev,
        category: value,
        // Clear job-specific fields when switching to result/admit-card
        startDate: value === 'upcoming-job' ? prev.startDate : '',
        salary: value === 'upcoming-job' ? prev.salary : '',
        posts: value === 'upcoming-job' ? prev.posts : '',
        details: ensureSectionDefaults(value)
      }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDetailChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        [key]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title || !formData.organization || !formData.description || 
        !formData.lastDate || !formData.applicationFee || !formData.applyLink || 
        !formData.eligibility) {
      setNotification('❌ Please fill all required fields.');
      setTimeout(() => setNotification(''), 5000);
      return;
    }
    
    // Category-specific validation
    if (formData.category === 'upcoming-job') {
      if (!formData.startDate || !formData.salary || !formData.posts) {
        setNotification('❌ Please fill all required fields for job posting.');
        setTimeout(() => setNotification(''), 5000);
        return;
      }
    }
    
    if (formData.category === 'scholarship' || formData.category === 'admission') {
      if (!formData.startDate) {
        setNotification('❌ Please fill start date for ' + formData.category + '.');
        setTimeout(() => setNotification(''), 5000);
        return;
      }
    }
    
    try {
      const submitData = { ...formData };
      
      // Remove job-specific fields for result and admit-card categories
      if (submitData.category === 'result' || submitData.category === 'admit-card') {
        delete submitData.startDate;
        delete submitData.salary;
        delete submitData.posts;
      }
      
      if (editingJob) {
        await jobsAPI.updateJob(editingJob._id, submitData);
        setNotification(`✅ ${formData.category.replace('-', ' ').toUpperCase()} updated successfully!`);
      } else {
        await jobsAPI.createJob(submitData);
        setNotification(`✅ New ${formData.category.replace('-', ' ').toUpperCase()} added successfully!`);
      }
      fetchJobs();
      resetForm();
      setTimeout(() => setNotification(''), 5000);
    } catch (error) {
      console.error('Error saving job:', error);
      const errorMessage = error.response?.data?.message || 'Error saving job. Please try again.';
      const errorDetails = error.response?.data?.errors ? ': ' + error.response.data.errors.join(', ') : '';
      setNotification(`❌ ${errorMessage}${errorDetails}`);
      setTimeout(() => setNotification(''), 8000);
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      organization: job.organization,
      category: job.category,
      description: job.description,
      lastDate: job.lastDate.split('T')[0],
      startDate: job.startDate ? job.startDate.split('T')[0] : '',
      applicationFee: job.applicationFee,
      applyLink: job.applyLink,
      organizationLink: job.organizationLink || '',
      shortNoticeLink: job.shortNoticeLink || '',
      syllabusLink: job.syllabusLink || '',
      youtubeLink: job.youtubeLink || '',
      eligibility: job.eligibility,
      salary: job.salary || '',
      posts: job.posts || '',
      details: ensureSectionDefaults(job.category, job.details || {})
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await jobsAPI.deleteJob(id);
        setNotification('🗑️ Job deleted successfully!');
        fetchJobs();
        setTimeout(() => setNotification(''), 5000);
      } catch (error) {
        console.error('Error deleting job:', error);
        setNotification('❌ Error deleting job. Please try again.');
        setTimeout(() => setNotification(''), 5000);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      organization: '',
      category: 'upcoming-job',
      description: '',
      lastDate: '',
      startDate: '',
      applicationFee: '',
      applyLink: '',
      organizationLink: '',
      shortNoticeLink: '',
      syllabusLink: '',
      youtubeLink: '',
      eligibility: '',
      salary: '',
      posts: '',
      details: ensureSectionDefaults('upcoming-job')
    });
    setEditingJob(null);
    setShowForm(false);
  };

  const handleYouTubeSubmit = async (e) => {
    e.preventDefault();
    
    if (!youtubeData.channelUrl) {
      setNotification('❌ Please fill YouTube Video URL.');
      setTimeout(() => setNotification(''), 5000);
      return;
    }
    
    try {
      await youtubeAPI.updateYouTube(youtubeData);
      setNotification('✅ YouTube channel updated successfully!');
      setShowYouTubeForm(false);
      setTimeout(() => setNotification(''), 5000);
    } catch (error) {
      console.error('Error updating YouTube data:', error);
      setNotification('❌ Error updating YouTube data. Please try again.');
      setTimeout(() => setNotification(''), 5000);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN');
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'result':
        return 'Result';
      case 'admit-card':
        return 'Admit Card';
      case 'upcoming-job':
        return 'Job Opening';
      case 'scholarship':
        return 'Scholarship';
      case 'admission':
        return 'Admission';
      default:
        return category;
    }
  };

  const categorySections = CATEGORY_SECTION_CONFIG[formData.category] || [];
  const modalSectionStyle = {
    background: 'rgba(248, 250, 252, 0.9)',
    border: '1px solid var(--color-border)',
    borderRadius: '20px',
    padding: '1.25rem',
    boxShadow: '0 22px 45px rgba(15, 23, 42, 0.12)'
  };
  const labelStyle = {
    display: 'block',
    marginBottom: '0.45rem',
    fontWeight: '600',
    color: 'var(--color-text)'
  };
  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid var(--color-border)',
    borderRadius: '12px',
    background: '#fff',
    fontSize: '0.95rem'
  };
  const textareaStyle = {
    ...inputStyle,
    minHeight: '110px',
    borderRadius: '14px',
    resize: 'vertical'
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        fontSize: '1.125rem'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 0', color: '#1f2937' }}>
      {/* Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: notification.includes('✅') ? '#10b981' : '#ef4444',
          color: 'white',
          padding: '1rem 2rem',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 1000,
          fontSize: '1rem',
          fontWeight: '500'
        }}>
          {notification}
        </div>
      )}
      
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#111827'
        }}>
          Admin Dashboard
        </h1>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <FaPlus />
            Add New Job
          </button>
          
          <button
            onClick={() => setShowYouTubeForm(true)}
            className="btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#ff0000',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            <FaYoutube />
            YT Update
          </button>
          
          <button
            onClick={handleLogout}
            className="btn btn-secondary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>

      {/* Stats - Now Clickable */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <button
          onClick={() => handleFilterChange('upcoming-job')}
          className="card card-rich"
          style={{
            textAlign: 'center',
            cursor: 'pointer',
            border: activeFilter === 'upcoming-job' ? '2px solid #3b82f6' : '1px solid #e5e7eb',
            background: activeFilter === 'upcoming-job' ? 'rgba(59, 130, 246, 0.1)' : '#ffffff',
            transition: 'all 0.3s ease',
            color: '#1f2937'
          }}
        >
          <h3 style={{ color: '#3b82f6', fontSize: '2rem', marginBottom: '0.5rem' }}>
            {(jobs || []).filter(job => job.category === 'upcoming-job').length}
          </h3>
          <p style={{ color: '#6b7280', margin: 0 }}>Upcoming Jobs</p>
        </button>
        
        <button
          onClick={() => handleFilterChange('result')}
          className="card card-rich"
          style={{
            textAlign: 'center',
            cursor: 'pointer',
            border: activeFilter === 'result' ? '2px solid #10b981' : '1px solid #e5e7eb',
            background: activeFilter === 'result' ? 'rgba(16, 185, 129, 0.1)' : '#ffffff',
            transition: 'all 0.3s ease',
            color: '#1f2937'
          }}
        >
          <h3 style={{ color: '#10b981', fontSize: '2rem', marginBottom: '0.5rem' }}>
            {(jobs || []).filter(job => job.category === 'result').length}
          </h3>
          <p style={{ color: '#6b7280', margin: 0 }}>Results</p>
        </button>
        
        <button
          onClick={() => handleFilterChange('admit-card')}
          className="card card-rich"
          style={{
            textAlign: 'center',
            cursor: 'pointer',
            border: activeFilter === 'admit-card' ? '2px solid #f59e0b' : '1px solid #e5e7eb',
            background: activeFilter === 'admit-card' ? 'rgba(245, 158, 11, 0.1)' : '#ffffff',
            transition: 'all 0.3s ease',
            color: '#1f2937'
          }}
        >
          <h3 style={{ color: '#f59e0b', fontSize: '2rem', marginBottom: '0.5rem' }}>
            {(jobs || []).filter(job => job.category === 'admit-card').length}
          </h3>
          <p style={{ color: '#6b7280', margin: 0 }}>Admit Cards</p>
        </button>
        
        <button
          onClick={() => handleFilterChange('scholarship')}
          className="card card-rich"
          style={{
            textAlign: 'center',
            cursor: 'pointer',
            border: activeFilter === 'scholarship' ? '2px solid #8b5cf6' : '1px solid #e5e7eb',
            background: activeFilter === 'scholarship' ? 'rgba(139, 92, 246, 0.1)' : '#ffffff',
            transition: 'all 0.3s ease',
            color: '#1f2937'
          }}
        >
          <h3 style={{ color: '#8b5cf6', fontSize: '2rem', marginBottom: '0.5rem' }}>
            {(jobs || []).filter(job => job.category === 'scholarship').length}
          </h3>
          <p style={{ color: '#6b7280', margin: 0 }}>Scholarships</p>
        </button>
        
        <button
          onClick={() => handleFilterChange('admission')}
          className="card card-rich"
          style={{
            textAlign: 'center',
            cursor: 'pointer',
            border: activeFilter === 'admission' ? '2px solid #06b6d4' : '1px solid #e5e7eb',
            background: activeFilter === 'admission' ? 'rgba(6, 182, 212, 0.1)' : '#ffffff',
            transition: 'all 0.3s ease',
            color: '#1f2937'
          }}
        >
          <h3 style={{ color: '#06b6d4', fontSize: '2rem', marginBottom: '0.5rem' }}>
            {(jobs || []).filter(job => job.category === 'admission').length}
          </h3>
          <p style={{ color: '#6b7280', margin: 0 }}>Admissions</p>
        </button>
        
        <button
          onClick={() => handleFilterChange('all')}
          className="card card-rich"
          style={{
            textAlign: 'center',
            cursor: 'pointer',
            border: activeFilter === 'all' ? '2px solid #6366f1' : isDarkTheme ? '1px solid #ffffff' : '1px solid #333333',
            background: isDarkTheme ? '#ffffff' : '#000000',
            transition: 'all 0.3s ease',
            color: isDarkTheme ? '#000000' : '#ffffff'
          }}
        >
          <h3 style={{ color: isDarkTheme ? '#000000' : '#ffffff', fontSize: '2rem', marginBottom: '0.5rem' }}>
            {(jobs || []).length}
          </h3>
          <p style={{ color: isDarkTheme ? '#000000' : '#ffffff', margin: 0 }}>Total Jobs</p>
        </button>
      </div>

      {/* Job Form Modal */}
      {showForm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            background: 'rgba(2, 6, 23, 0.75)',
            backdropFilter: 'blur(18px)',
            zIndex: 1200
          }}
        >
          <div
            className="modal-scroll"
            role="dialog"
            aria-modal="true"
            style={{
              width: 'min(920px, 95vw)',
              maxHeight: '90vh',
              borderRadius: '32px',
              background: 'linear-gradient(145deg, #0f172a 0%, #101c32 100%)',
              border: '1px solid rgba(148, 163, 184, 0.35)',
              boxShadow: '0 60px 140px rgba(2, 6, 23, 0.65)',
              overflowY: 'auto'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              padding: '2rem 2rem 1.25rem'
            }}>
              <div>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '999px',
                  fontSize: '0.85rem',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  background: 'rgba(248, 250, 252, 0.08)',
                  color: '#cbd5f5',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  {editingJob ? 'Editing Live Post' : 'New Job Blueprint'}
                </span>
                <h2 style={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  marginTop: '0.75rem',
                  color: '#fff'
                }}>
                  {editingJob ? 'Update job posting' : 'Add a job posting'}
                </h2>
                <p style={{ color: '#cbd5f5', marginTop: '0.35rem' }}>
                  Provide only the sections you want candidates to see — empty fields stay hidden on the public page.
                </p>
              </div>
              <button
                onClick={resetForm}
                aria-label="Close job form"
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <FaTimes />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              style={{
                padding: '0 2rem 2.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem'
              }}
            >
              <section style={modalSectionStyle}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>General Information</h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '1rem'
                }}>
                  <div>
                    <label style={labelStyle}>Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Organization *</label>
                    <input
                      type="text"
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      required
                      style={inputStyle}
                    />
                  </div>
                </div>
              </section>

              <section style={modalSectionStyle}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Classification & Timeline</h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '1rem'
                }}>
                  <div>
                    <label style={labelStyle}>Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      style={inputStyle}
                    >
                      <option value="upcoming-job">Upcoming Job</option>
                      <option value="result">Result</option>
                      <option value="admit-card">Admit Card</option>
                      <option value="scholarship">Scholarship</option>
                      <option value="admission">Admission</option>
                    </select>
                  </div>
                  {formData.category === 'upcoming-job' && (
                    <div>
                      <label style={labelStyle}>Posts *</label>
                      <input
                        type="number"
                        name="posts"
                        value={formData.posts}
                        onChange={handleChange}
                        required={formData.category === 'upcoming-job'}
                        min="1"
                        style={inputStyle}
                      />
                    </div>
                  )}
                  {formData.category === 'upcoming-job' && (
                    <div>
                      <label style={labelStyle}>Start Date *</label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required={formData.category === 'upcoming-job'}
                        style={inputStyle}
                      />
                    </div>
                  )}
                  {(formData.category === 'scholarship' || formData.category === 'admission') && (
                    <div>
                      <label style={labelStyle}>Start Date *</label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                        style={inputStyle}
                      />
                    </div>
                  )}
                  <div>
                    <label style={labelStyle}>
                      {(formData.category === 'scholarship' || formData.category === 'admission') ? 'End Date *' :
                       formData.category === 'result' || formData.category === 'admit-card' ? 'Post Date *' : 'Last Date *'}
                    </label>
                    <input
                      type="date"
                      name="lastDate"
                      value={formData.lastDate}
                      onChange={handleChange}
                      required
                      style={inputStyle}
                    />
                  </div>
                </div>
              </section>

              <section style={modalSectionStyle}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Narrative Blocks</h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <label style={labelStyle}>Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      style={{ ...textareaStyle, minHeight: '120px' }}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Eligibility *</label>
                    <textarea
                      name="eligibility"
                      value={formData.eligibility}
                      onChange={handleChange}
                      required
                      style={{ ...textareaStyle, minHeight: '100px' }}
                    />
                  </div>
                </div>
              </section>

              <section style={modalSectionStyle}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Fee, Compensation & Links</h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1rem'
                }}>
                  <div>
                    <label style={labelStyle}>Application Fee *</label>
                    <input
                      type="text"
                      name="applicationFee"
                      value={formData.applicationFee}
                      onChange={handleChange}
                      required
                      placeholder="e.g., ₹500 or Free"
                      style={inputStyle}
                    />
                  </div>
                  {formData.category === 'upcoming-job' && (
                    <div>
                      <label style={labelStyle}>Salary / Pay *</label>
                      <input
                        type="text"
                        name="salary"
                        value={formData.salary}
                        onChange={handleChange}
                        required={formData.category === 'upcoming-job'}
                        placeholder="e.g., ₹25,000 - ₹50,000"
                        style={inputStyle}
                      />
                    </div>
                  )}
                </div>
                <div style={{ marginTop: '1rem' }}>
                  <label style={labelStyle}>Apply Link *</label>
                  <input
                    type="url"
                    name="applyLink"
                    value={formData.applyLink}
                    onChange={handleChange}
                    required
                    placeholder="https://example.com/apply"
                    style={inputStyle}
                  />
                </div>
                <div style={{
                  marginTop: '1rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1rem'
                }}>
                  <div>
                    <label style={labelStyle}>Official Website Link</label>
                    <input
                      type="url"
                      name="organizationLink"
                      value={formData.organizationLink}
                      onChange={handleChange}
                      placeholder="https://department.gov.in"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Short Notice Link</label>
                    <input
                      type="url"
                      name="shortNoticeLink"
                      value={formData.shortNoticeLink}
                      onChange={handleChange}
                      placeholder="https://example.com/short-notice.pdf"
                      style={inputStyle}
                    />
                  </div>
                </div>
                <div style={{
                  marginTop: '1rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1rem'
                }}>
                  <div>
                    <label style={labelStyle}>Syllabus / Notification Link</label>
                    <input
                      type="url"
                      name="syllabusLink"
                      value={formData.syllabusLink}
                      onChange={handleChange}
                      placeholder="https://example.com/syllabus.pdf"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>YouTube Video Link</label>
                    <input
                      type="url"
                      name="youtubeLink"
                      value={formData.youtubeLink}
                      onChange={handleChange}
                      placeholder="https://youtu.be/abcd1234"
                      style={inputStyle}
                    />
                  </div>
                </div>
              </section>

              {categorySections.length > 0 && (
                <section style={{
                  ...modalSectionStyle,
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#e2e8f0'
                }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem', color: '#fff' }}>
                    Category Specific Spotlight
                  </h3>
                  <p style={{
                    marginBottom: '1.5rem',
                    color: '#cbd5f5'
                  }}>
                    Fill the sections that matter. Only populated blocks are rendered for candidates, letting you keep the layout clean.
                  </p>

                  {categorySections.map((field) => (
                    <div key={field.key} style={{ marginBottom: '1.15rem' }}>
                      <label style={{
                        ...labelStyle,
                        color: '#fff'
                      }}>
                        {field.label}
                      </label>
                      {field.type === 'text' ? (
                        <input
                          type="text"
                          value={formData.details?.[field.key] || ''}
                          onChange={(event) => handleDetailChange(field.key, event.target.value)}
                          placeholder={field.placeholder}
                          style={{
                            ...inputStyle,
                            background: 'rgba(15, 23, 42, 0.65)',
                            color: '#fff'
                          }}
                        />
                      ) : (
                        <textarea
                          value={formData.details?.[field.key] || ''}
                          onChange={(event) => handleDetailChange(field.key, event.target.value)}
                          placeholder={field.placeholder}
                          rows={field.type === 'textarea' ? 4 : 2}
                          style={{
                            ...textareaStyle,
                            background: 'rgba(15, 23, 42, 0.65)',
                            color: '#fff'
                          }}
                        />
                      )}
                      {field.helper && (
                        <p style={{
                          marginTop: '0.35rem',
                          fontSize: '0.85rem',
                          color: '#cbd5f5'
                        }}>
                          {field.helper}
                        </p>
                      )}
                    </div>
                  ))}
                </section>
              )}

              <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'flex-end'
              }}>
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ minWidth: '160px' }}
                >
                  {editingJob ? 'Update Job' : 'Create Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Jobs Table */}
      <div className="card card-rich" style={{ marginTop: '2rem' }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          marginBottom: '1.5rem',
          color: '#111827'
        }}>
          {activeFilter === 'all' ? 'All Jobs' : 
           activeFilter === 'upcoming-job' ? 'Upcoming Jobs' :
           activeFilter === 'result' ? 'Results' : 
           activeFilter === 'admit-card' ? 'Admit Cards' :
           activeFilter === 'scholarship' ? 'Scholarships' :
           activeFilter === 'admission' ? 'Admissions' : 'Jobs'} ({filteredJobs.length})
        </h2>

        {(filteredJobs || []).length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: 'var(--color-card-muted)'
          }}>
            <p>No jobs found. Create your first job!</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              color: '#374151'
            }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.15)' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.08em' }}>Title</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.08em' }}>Organization</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.08em' }}>Category</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.08em' }}>Last Date</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.08em' }}>Posts</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.08em' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(filteredJobs || []).map(job => (
                  <tr key={job._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: '600', marginBottom: '2px' }}>
                        {job.title}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--color-card-muted)' }}>
                        Created: {formatDate(job.createdAt)}
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>{job.organization}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        background: job.category === 'result' ? 'rgba(16, 185, 129, 0.2)' : 
                                   job.category === 'admit-card' ? 'rgba(59, 130, 246, 0.2)' : 
                                   job.category === 'scholarship' ? 'rgba(139, 92, 246, 0.2)' :
                                   job.category === 'admission' ? 'rgba(6, 182, 212, 0.2)' : 'rgba(248, 113, 113, 0.2)',
                        color: job.category === 'result' ? '#86efac' : 
                               job.category === 'admit-card' ? '#93c5fd' : 
                               job.category === 'scholarship' ? '#c4b5fd' :
                               job.category === 'admission' ? '#67e8f9' : '#fecaca'
                      }}>
                        {getCategoryLabel(job.category)}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>{formatDate(job.lastDate)}</td>
                    <td style={{ padding: '12px' }}>{job.posts}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        <button
                          onClick={() => window.open(`/job/${job._id}`, '_blank')}
                          style={{
                            background: 'rgba(148, 163, 184, 0.15)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '6px',
                            padding: '6px',
                            cursor: 'pointer',
                            color: 'var(--color-card-text)'
                          }}
                          title="View"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleEdit(job)}
                          style={{
                            background: 'rgba(251, 191, 36, 0.15)',
                            border: '1px solid rgba(251, 191, 36, 0.3)',
                            borderRadius: '6px',
                            padding: '6px',
                            cursor: 'pointer',
                            color: '#fcd34d'
                          }}
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(job._id)}
                          style={{
                            background: 'rgba(248, 113, 113, 0.15)',
                            border: '1px solid rgba(248, 113, 113, 0.3)',
                            borderRadius: '6px',
                            padding: '6px',
                            cursor: 'pointer',
                            color: '#fca5a5'
                          }}
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* YouTube Update Form Modal */}
      {showYouTubeForm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            background: 'rgba(2, 6, 23, 0.75)',
            backdropFilter: 'blur(18px)',
            zIndex: 1200
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            style={{
              width: 'min(600px, 95vw)',
              borderRadius: '32px',
              background: 'linear-gradient(145deg, #0f172a 0%, #101c32 100%)',
              border: '1px solid rgba(148, 163, 184, 0.35)',
              boxShadow: '0 60px 140px rgba(2, 6, 23, 0.65)',
              overflow: 'hidden'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              padding: '2rem 2rem 1.25rem'
            }}>
              <div>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '999px',
                  fontSize: '0.85rem',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  background: 'rgba(255, 0, 0, 0.2)',
                  color: '#ff6b6b',
                  border: '1px solid rgba(255, 0, 0, 0.3)'
                }}>
                  <FaYoutube />
                  YouTube Channel
                </span>
                <h2 style={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  marginTop: '0.75rem',
                  color: '#fff'
                }}>
                  Update YouTube Channel
                </h2>
                <p style={{ color: '#cbd5f5', marginTop: '0.35rem' }}>
                  Update the YouTube channel URL and thumbnail that appears on the homepage.
                </p>
              </div>
              <button
                onClick={() => setShowYouTubeForm(false)}
                aria-label="Close YouTube form"
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <FaTimes />
              </button>
            </div>

            <form
              onSubmit={handleYouTubeSubmit}
              style={{
                padding: '0 2rem 2.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem'
              }}
            >
              <section style={{
                background: 'rgba(248, 250, 252, 0.9)',
                border: '1px solid var(--color-border)',
                borderRadius: '20px',
                padding: '1.25rem',
                boxShadow: '0 22px 45px rgba(15, 23, 42, 0.12)'
              }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>YouTube Video Information</h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.45rem',
                      fontWeight: '600',
                      color: 'var(--color-text)'
                    }}>YouTube Video URL *</label>
                    <input
                      type="url"
                      value={youtubeData.channelUrl}
                      onChange={(e) => setYoutubeData(prev => ({ ...prev, channelUrl: e.target.value }))}
                      required
                      placeholder="https://www.youtube.com/watch?v=..."
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        border: '1px solid var(--color-border)',
                        borderRadius: '12px',
                        background: '#fff',
                        fontSize: '0.95rem'
                      }}
                    />
                  </div>
                </div>
              </section>

              <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'flex-end'
              }}>
                <button
                  type="button"
                  onClick={() => setShowYouTubeForm(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn"
                  style={{
                    minWidth: '160px',
                    background: '#ff0000',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Update YouTube
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;