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
  const [isDarkTheme, setIsDarkTheme] = useState(true);
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
  
  // Theme detection removed - always dark theme

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
    
    // Only validate fields with asterisks (*) - matches backend
    if (!formData.title || !formData.organization || !formData.category || 
        !formData.lastDate || !formData.applyLink) {
      setNotification('❌ Please fill all required fields: Title, Organization, Category, Last Date, and Apply Link.');
      setTimeout(() => setNotification(''), 5000);
      return;
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
    background: isDarkTheme ? 'rgba(15, 23, 42, 0.6)' : 'rgba(248, 250, 252, 0.9)',
    border: isDarkTheme ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e5e7eb',
    borderRadius: '20px',
    padding: '1.25rem',
    boxShadow: '0 22px 45px rgba(15, 23, 42, 0.12)'
  };
  const labelStyle = {
    display: 'block',
    marginBottom: '0.45rem',
    fontWeight: '600',
    color: isDarkTheme ? '#fff' : '#374151'
  };
  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    border: isDarkTheme ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #d1d5db',
    borderRadius: '12px',
    background: isDarkTheme ? 'rgba(15, 23, 42, 0.8)' : '#fff',
    color: isDarkTheme ? '#fff' : '#374151',
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
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      color: '#f1f5f9'
    }}>
      {/* Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: notification.includes('✅') 
            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
            : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: 'white',
          padding: '1rem 2rem',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          zIndex: 1000,
          fontSize: '1rem',
          fontWeight: '500',
          backdropFilter: 'blur(10px)'
        }}>
          {notification}
        </div>
      )}
      
      {/* Header */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
        padding: '2rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                color: isDarkTheme ? '#f1f5f9' : '#1e293b',
                margin: 0,
                marginBottom: '0.5rem'
              }}>
                Admin Dashboard
              </h1>
              <p style={{
                color: isDarkTheme ? '#94a3b8' : '#64748b',
                fontSize: '1.1rem',
                margin: 0
              }}>
                Manage your content with ease
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setShowForm(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '0.875rem 1.75rem',
                  borderRadius: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.3)';
                }}
              >
                <FaPlus />
                Add New Job
              </button>
              
              <button
                onClick={() => setShowYouTubeForm(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '0.875rem 1.75rem',
                  borderRadius: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(239, 68, 68, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.3)';
                }}
              >
                <FaYoutube />
                YT Update
              </button>
              
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: isDarkTheme 
                    ? 'linear-gradient(135deg, #64748b 0%, #475569 100%)' 
                    : 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '0.875rem 1.75rem',
                  borderRadius: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  boxShadow: '0 4px 15px rgba(107, 114, 128, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(107, 114, 128, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(107, 114, 128, 0.3)';
                }}
              >
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="container" style={{ padding: '3rem 0' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          <button
            onClick={() => handleFilterChange('upcoming-job')}
            style={{
              background: isDarkTheme 
                ? (activeFilter === 'upcoming-job' 
                  ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' 
                  : 'rgba(30, 41, 59, 0.8)')
                : (activeFilter === 'upcoming-job' 
                  ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' 
                  : '#ffffff'),
              border: isDarkTheme 
                ? '1px solid rgba(148, 163, 184, 0.2)' 
                : '1px solid rgba(0, 0, 0, 0.1)',
              borderRadius: '16px',
              padding: '2rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: isDarkTheme 
                ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
                : '0 8px 32px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              color: activeFilter === 'upcoming-job' ? '#ffffff' : (isDarkTheme ? '#f1f5f9' : '#1e293b')
            }}
            onMouseEnter={(e) => {
              if (activeFilter !== 'upcoming-job') {
                e.target.style.transform = 'translateY(-4px)';
                e.target.style.boxShadow = isDarkTheme 
                  ? '0 12px 40px rgba(0, 0, 0, 0.4)' 
                  : '0 12px 40px rgba(0, 0, 0, 0.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeFilter !== 'upcoming-job') {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = isDarkTheme 
                  ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
                  : '0 8px 32px rgba(0, 0, 0, 0.1)';
              }
            }}
          >
            <h3 style={{ 
              fontSize: '3rem', 
              fontWeight: '700', 
              marginBottom: '0.5rem',
              color: activeFilter === 'upcoming-job' ? '#ffffff' : '#3b82f6'
            }}>
              {(jobs || []).filter(job => job.category === 'upcoming-job').length}
            </h3>
            <p style={{ 
              margin: 0, 
              fontSize: '1.1rem', 
              fontWeight: '500',
              color: activeFilter === 'upcoming-job' ? 'rgba(255, 255, 255, 0.9)' : (isDarkTheme ? '#94a3b8' : '#64748b')
            }}>Upcoming Jobs</p>
          </button>
          
          <button
            onClick={() => handleFilterChange('result')}
            style={{
              background: isDarkTheme 
                ? (activeFilter === 'result' 
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                  : 'rgba(30, 41, 59, 0.8)')
                : (activeFilter === 'result' 
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                  : '#ffffff'),
              border: isDarkTheme 
                ? '1px solid rgba(148, 163, 184, 0.2)' 
                : '1px solid rgba(0, 0, 0, 0.1)',
              borderRadius: '16px',
              padding: '2rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: isDarkTheme 
                ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
                : '0 8px 32px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              color: activeFilter === 'result' ? '#ffffff' : (isDarkTheme ? '#f1f5f9' : '#1e293b')
            }}
            onMouseEnter={(e) => {
              if (activeFilter !== 'result') {
                e.target.style.transform = 'translateY(-4px)';
                e.target.style.boxShadow = isDarkTheme 
                  ? '0 12px 40px rgba(0, 0, 0, 0.4)' 
                  : '0 12px 40px rgba(0, 0, 0, 0.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeFilter !== 'result') {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = isDarkTheme 
                  ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
                  : '0 8px 32px rgba(0, 0, 0, 0.1)';
              }
            }}
          >
            <h3 style={{ 
              fontSize: '3rem', 
              fontWeight: '700', 
              marginBottom: '0.5rem',
              color: activeFilter === 'result' ? '#ffffff' : '#10b981'
            }}>
              {(jobs || []).filter(job => job.category === 'result').length}
            </h3>
            <p style={{ 
              margin: 0, 
              fontSize: '1.1rem', 
              fontWeight: '500',
              color: activeFilter === 'result' ? 'rgba(255, 255, 255, 0.9)' : (isDarkTheme ? '#94a3b8' : '#64748b')
            }}>Results</p>
          </button>
          
          <button
            onClick={() => handleFilterChange('admit-card')}
            style={{
              background: isDarkTheme 
                ? (activeFilter === 'admit-card' 
                  ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' 
                  : 'rgba(30, 41, 59, 0.8)')
                : (activeFilter === 'admit-card' 
                  ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' 
                  : '#ffffff'),
              border: isDarkTheme 
                ? '1px solid rgba(148, 163, 184, 0.2)' 
                : '1px solid rgba(0, 0, 0, 0.1)',
              borderRadius: '16px',
              padding: '2rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: isDarkTheme 
                ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
                : '0 8px 32px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              color: activeFilter === 'admit-card' ? '#ffffff' : (isDarkTheme ? '#f1f5f9' : '#1e293b')
            }}
            onMouseEnter={(e) => {
              if (activeFilter !== 'admit-card') {
                e.target.style.transform = 'translateY(-4px)';
                e.target.style.boxShadow = isDarkTheme 
                  ? '0 12px 40px rgba(0, 0, 0, 0.4)' 
                  : '0 12px 40px rgba(0, 0, 0, 0.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeFilter !== 'admit-card') {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = isDarkTheme 
                  ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
                  : '0 8px 32px rgba(0, 0, 0, 0.1)';
              }
            }}
          >
            <h3 style={{ 
              fontSize: '3rem', 
              fontWeight: '700', 
              marginBottom: '0.5rem',
              color: activeFilter === 'admit-card' ? '#ffffff' : '#f59e0b'
            }}>
              {(jobs || []).filter(job => job.category === 'admit-card').length}
            </h3>
            <p style={{ 
              margin: 0, 
              fontSize: '1.1rem', 
              fontWeight: '500',
              color: activeFilter === 'admit-card' ? 'rgba(255, 255, 255, 0.9)' : (isDarkTheme ? '#94a3b8' : '#64748b')
            }}>Admit Cards</p>
          </button>
          
          <button
            onClick={() => handleFilterChange('scholarship')}
            style={{
              background: isDarkTheme 
                ? (activeFilter === 'scholarship' 
                  ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' 
                  : 'rgba(30, 41, 59, 0.8)')
                : (activeFilter === 'scholarship' 
                  ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' 
                  : '#ffffff'),
              border: isDarkTheme 
                ? '1px solid rgba(148, 163, 184, 0.2)' 
                : '1px solid rgba(0, 0, 0, 0.1)',
              borderRadius: '16px',
              padding: '2rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: isDarkTheme 
                ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
                : '0 8px 32px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              color: activeFilter === 'scholarship' ? '#ffffff' : (isDarkTheme ? '#f1f5f9' : '#1e293b')
            }}
            onMouseEnter={(e) => {
              if (activeFilter !== 'scholarship') {
                e.target.style.transform = 'translateY(-4px)';
                e.target.style.boxShadow = isDarkTheme 
                  ? '0 12px 40px rgba(0, 0, 0, 0.4)' 
                  : '0 12px 40px rgba(0, 0, 0, 0.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeFilter !== 'scholarship') {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = isDarkTheme 
                  ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
                  : '0 8px 32px rgba(0, 0, 0, 0.1)';
              }
            }}
          >
            <h3 style={{ 
              fontSize: '3rem', 
              fontWeight: '700', 
              marginBottom: '0.5rem',
              color: activeFilter === 'scholarship' ? '#ffffff' : '#8b5cf6'
            }}>
              {(jobs || []).filter(job => job.category === 'scholarship').length}
            </h3>
            <p style={{ 
              margin: 0, 
              fontSize: '1.1rem', 
              fontWeight: '500',
              color: activeFilter === 'scholarship' ? 'rgba(255, 255, 255, 0.9)' : (isDarkTheme ? '#94a3b8' : '#64748b')
            }}>Scholarships</p>
          </button>
          
          <button
            onClick={() => handleFilterChange('admission')}
            style={{
              background: isDarkTheme 
                ? (activeFilter === 'admission' 
                  ? 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)' 
                  : 'rgba(30, 41, 59, 0.8)')
                : (activeFilter === 'admission' 
                  ? 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)' 
                  : '#ffffff'),
              border: isDarkTheme 
                ? '1px solid rgba(148, 163, 184, 0.2)' 
                : '1px solid rgba(0, 0, 0, 0.1)',
              borderRadius: '16px',
              padding: '2rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: isDarkTheme 
                ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
                : '0 8px 32px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              color: activeFilter === 'admission' ? '#ffffff' : (isDarkTheme ? '#f1f5f9' : '#1e293b')
            }}
            onMouseEnter={(e) => {
              if (activeFilter !== 'admission') {
                e.target.style.transform = 'translateY(-4px)';
                e.target.style.boxShadow = isDarkTheme 
                  ? '0 12px 40px rgba(0, 0, 0, 0.4)' 
                  : '0 12px 40px rgba(0, 0, 0, 0.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeFilter !== 'admission') {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = isDarkTheme 
                  ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
                  : '0 8px 32px rgba(0, 0, 0, 0.1)';
              }
            }}
          >
            <h3 style={{ 
              fontSize: '3rem', 
              fontWeight: '700', 
              marginBottom: '0.5rem',
              color: activeFilter === 'admission' ? '#ffffff' : '#06b6d4'
            }}>
              {(jobs || []).filter(job => job.category === 'admission').length}
            </h3>
            <p style={{ 
              margin: 0, 
              fontSize: '1.1rem', 
              fontWeight: '500',
              color: activeFilter === 'admission' ? 'rgba(255, 255, 255, 0.9)' : (isDarkTheme ? '#94a3b8' : '#64748b')
            }}>Admissions</p>
          </button>
          
          <button
            onClick={() => handleFilterChange('all')}
            style={{
              background: isDarkTheme 
                ? (activeFilter === 'all' 
                  ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' 
                  : 'rgba(30, 41, 59, 0.8)')
                : (activeFilter === 'all' 
                  ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' 
                  : '#ffffff'),
              border: isDarkTheme 
                ? '1px solid rgba(148, 163, 184, 0.2)' 
                : '1px solid rgba(0, 0, 0, 0.1)',
              borderRadius: '16px',
              padding: '2rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: isDarkTheme 
                ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
                : '0 8px 32px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              color: activeFilter === 'all' ? '#ffffff' : (isDarkTheme ? '#f1f5f9' : '#1e293b')
            }}
            onMouseEnter={(e) => {
              if (activeFilter !== 'all') {
                e.target.style.transform = 'translateY(-4px)';
                e.target.style.boxShadow = isDarkTheme 
                  ? '0 12px 40px rgba(0, 0, 0, 0.4)' 
                  : '0 12px 40px rgba(0, 0, 0, 0.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeFilter !== 'all') {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = isDarkTheme 
                  ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
                  : '0 8px 32px rgba(0, 0, 0, 0.1)';
              }
            }}
          >
            <h3 style={{ 
              fontSize: '3rem', 
              fontWeight: '700', 
              marginBottom: '0.5rem',
              color: activeFilter === 'all' ? '#ffffff' : '#ef4444'
            }}>
              {(jobs || []).length}
            </h3>
            <p style={{ 
              margin: 0, 
              fontSize: '1.1rem', 
              fontWeight: '500',
              color: activeFilter === 'all' ? 'rgba(255, 255, 255, 0.9)' : (isDarkTheme ? '#94a3b8' : '#64748b')
            }}>Total Jobs</p>
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
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: isDarkTheme ? '#fff' : '#374151' }}>General Information</h3>
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
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: isDarkTheme ? '#fff' : '#374151' }}>Classification & Timeline</h3>
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
                      <label style={labelStyle}>Posts</label>
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
                      <label style={labelStyle}>Start Date</label>
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
                      <label style={labelStyle}>Start Date</label>
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
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: isDarkTheme ? '#fff' : '#374151' }}>Narrative Blocks</h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <label style={labelStyle}>Description{(formData.category === 'upcoming-job' || formData.category === 'scholarship' || formData.category === 'admission') ? ' *' : ''}</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required={formData.category === 'upcoming-job' || formData.category === 'scholarship' || formData.category === 'admission'}
                      style={{ ...textareaStyle, minHeight: '120px' }}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Eligibility{(formData.category === 'upcoming-job' || formData.category === 'scholarship' || formData.category === 'admission') ? ' *' : ''}</label>
                    <textarea
                      name="eligibility"
                      value={formData.eligibility}
                      onChange={handleChange}
                      required={formData.category === 'upcoming-job' || formData.category === 'scholarship' || formData.category === 'admission'}
                      style={{ ...textareaStyle, minHeight: '100px' }}
                    />
                  </div>
                </div>
              </section>

              <section style={modalSectionStyle}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: isDarkTheme ? '#fff' : '#374151' }}>Fee, Compensation & Links</h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1rem'
                }}>
                  <div>
                    <label style={labelStyle}>Application Fee</label>
                    <input
                      type="text"
                      name="applicationFee"
                      value={formData.applicationFee}
                      onChange={handleChange}
                      required={formData.category === 'upcoming-job' || formData.category === 'scholarship' || formData.category === 'admission'}
                      placeholder="e.g., ₹500 or Free"
                      style={inputStyle}
                    />
                  </div>
                  {formData.category === 'upcoming-job' && (
                    <div>
                      <label style={labelStyle}>Salary / Pay</label>
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
                  background: isDarkTheme ? 'rgba(15, 23, 42, 0.9)' : 'rgba(248, 250, 252, 0.95)',
                  border: isDarkTheme ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #e5e7eb',
                  color: isDarkTheme ? '#e2e8f0' : '#374151'
                }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem', color: isDarkTheme ? '#fff' : '#374151' }}>
                    Category Specific Spotlight
                  </h3>
                  <p style={{
                    marginBottom: '1.5rem',
                    color: isDarkTheme ? '#cbd5f5' : '#6b7280'
                  }}>
                    Fill the sections that matter. Only populated blocks are rendered for candidates, letting you keep the layout clean.
                  </p>

                  {categorySections.map((field) => (
                    <div key={field.key} style={{ marginBottom: '1.15rem' }}>
                      <label style={{
                        ...labelStyle,
                        color: isDarkTheme ? '#fff' : '#374151'
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
                            background: isDarkTheme ? 'rgba(15, 23, 42, 0.65)' : '#f9fafb',
                            color: isDarkTheme ? '#fff' : '#374151'
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
                            background: isDarkTheme ? 'rgba(15, 23, 42, 0.65)' : '#f9fafb',
                            color: isDarkTheme ? '#fff' : '#374151'
                          }}
                        />
                      )}
                      {field.helper && (
                        <p style={{
                          marginTop: '0.35rem',
                          fontSize: '0.85rem',
                          color: isDarkTheme ? '#cbd5f5' : '#6b7280'
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
      <div style={{
        background: isDarkTheme 
          ? 'rgba(30, 41, 59, 0.8)' 
          : '#ffffff',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: isDarkTheme 
          ? '0 20px 60px rgba(0, 0, 0, 0.4)' 
          : '0 20px 60px rgba(0, 0, 0, 0.1)',
        border: isDarkTheme 
          ? '1px solid rgba(148, 163, 184, 0.2)' 
          : '1px solid rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(20px)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          paddingBottom: '1rem',
          borderBottom: isDarkTheme 
            ? '1px solid rgba(148, 163, 184, 0.2)' 
            : '1px solid rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: '700',
            color: isDarkTheme ? '#f1f5f9' : '#1e293b',
            margin: 0
          }}>
            {activeFilter === 'all' ? 'All Jobs' : 
             activeFilter === 'upcoming-job' ? 'Upcoming Jobs' :
             activeFilter === 'result' ? 'Results' : 
             activeFilter === 'admit-card' ? 'Admit Cards' :
             activeFilter === 'scholarship' ? 'Scholarships' :
             activeFilter === 'admission' ? 'Admissions' : 'Jobs'}
          </h2>
          <div style={{
            color: isDarkTheme ? '#f1f5f9' : '#1e293b',
            fontSize: '1.1rem',
            fontWeight: '600'
          }}>
            {filteredJobs.length}
          </div>
        </div>

        {(filteredJobs || []).length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            color: isDarkTheme ? '#94a3b8' : '#64748b'
          }}>
            <div style={{
              fontSize: '4rem',
              marginBottom: '1rem',
              opacity: 0.5
            }}>📋</div>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: isDarkTheme ? '#f1f5f9' : '#1e293b'
            }}>No jobs found</h3>
            <p style={{
              fontSize: '1.1rem',
              opacity: 0.8
            }}>Create your first job to get started!</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'separate',
              borderSpacing: '0 8px',
              color: isDarkTheme ? '#f1f5f9' : '#1e293b'
            }}>
              <thead>
                <tr>
                  <th style={{ 
                    padding: '1rem 1.5rem', 
                    textAlign: 'left', 
                    fontWeight: '600', 
                    color: isDarkTheme ? '#94a3b8' : '#64748b', 
                    textTransform: 'uppercase', 
                    fontSize: '0.8rem', 
                    letterSpacing: '0.1em',
                    background: isDarkTheme 
                      ? 'rgba(15, 23, 42, 0.5)' 
                      : 'rgba(248, 250, 252, 0.8)',
                    borderRadius: '12px 0 0 12px'
                  }}>Title & Organization</th>
                  <th style={{ 
                    padding: '1rem 1.5rem', 
                    textAlign: 'left', 
                    fontWeight: '600', 
                    color: isDarkTheme ? '#94a3b8' : '#64748b', 
                    textTransform: 'uppercase', 
                    fontSize: '0.8rem', 
                    letterSpacing: '0.1em',
                    background: isDarkTheme 
                      ? 'rgba(15, 23, 42, 0.5)' 
                      : 'rgba(248, 250, 252, 0.8)'
                  }}>Category</th>
                  <th style={{ 
                    padding: '1rem 1.5rem', 
                    textAlign: 'left', 
                    fontWeight: '600', 
                    color: isDarkTheme ? '#94a3b8' : '#64748b', 
                    textTransform: 'uppercase', 
                    fontSize: '0.8rem', 
                    letterSpacing: '0.1em',
                    background: isDarkTheme 
                      ? 'rgba(15, 23, 42, 0.5)' 
                      : 'rgba(248, 250, 252, 0.8)'
                  }}>Last Date</th>
                  <th style={{ 
                    padding: '1rem 1.5rem', 
                    textAlign: 'left', 
                    fontWeight: '600', 
                    color: isDarkTheme ? '#94a3b8' : '#64748b', 
                    textTransform: 'uppercase', 
                    fontSize: '0.8rem', 
                    letterSpacing: '0.1em',
                    background: isDarkTheme 
                      ? 'rgba(15, 23, 42, 0.5)' 
                      : 'rgba(248, 250, 252, 0.8)'
                  }}>Posts</th>
                  <th style={{ 
                    padding: '1rem 1.5rem', 
                    textAlign: 'center', 
                    fontWeight: '600', 
                    color: isDarkTheme ? '#94a3b8' : '#64748b', 
                    textTransform: 'uppercase', 
                    fontSize: '0.8rem', 
                    letterSpacing: '0.1em',
                    background: isDarkTheme 
                      ? 'rgba(15, 23, 42, 0.5)' 
                      : 'rgba(248, 250, 252, 0.8)',
                    borderRadius: '0 12px 12px 0'
                  }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(filteredJobs || []).map(job => (
                  <tr key={job._id} style={{ 
                    background: isDarkTheme 
                      ? 'rgba(30, 41, 59, 0.6)' 
                      : '#ffffff',
                    borderRadius: '12px',
                    boxShadow: isDarkTheme 
                      ? '0 4px 20px rgba(0, 0, 0, 0.3)' 
                      : '0 4px 20px rgba(0, 0, 0, 0.08)',
                    border: isDarkTheme 
                      ? '1px solid rgba(148, 163, 184, 0.1)' 
                      : '1px solid rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.3s ease'
                  }}>
                    <td style={{ 
                      padding: '1.5rem',
                      borderRadius: '12px 0 0 12px'
                    }}>
                      <div style={{ fontWeight: '600', marginBottom: '4px', color: isDarkTheme ? '#f1f5f9' : '#1e293b', fontSize: '1.1rem' }}>
                        {job.title}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: isDarkTheme ? '#94a3b8' : '#64748b', fontWeight: '500' }}>
                        {job.organization}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: isDarkTheme ? '#64748b' : '#9ca3af', marginTop: '4px' }}>
                        Created: {formatDate(job.createdAt)}
                      </div>
                    </td>
                    <td style={{ padding: '1.5rem' }}>
                      <span style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        whiteSpace: 'nowrap',
                        display: 'inline-block',
                        background: job.category === 'result' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 
                                   job.category === 'admit-card' ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : 
                                   job.category === 'scholarship' ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' :
                                   job.category === 'admission' ? 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        color: '#ffffff',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                      }}>
                        {getCategoryLabel(job.category)}
                      </span>
                    </td>
                    <td style={{ padding: '1.5rem', color: isDarkTheme ? '#f1f5f9' : '#1e293b', fontWeight: '500' }}>{formatDate(job.lastDate)}</td>
                    <td style={{ padding: '1.5rem', color: isDarkTheme ? '#f1f5f9' : '#1e293b', fontWeight: '500' }}>{job.posts || '-'}</td>
                    <td style={{ padding: '1.5rem', textAlign: 'center', borderRadius: '0 12px 12px 0' }}>
                      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                        <button
                          onClick={() => window.open(`/job/${job._id}`, '_blank')}
                          style={{
                            background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '10px',
                            cursor: 'pointer',
                            color: '#ffffff',
                            boxShadow: '0 4px 15px rgba(100, 116, 139, 0.3)',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 8px 25px rgba(100, 116, 139, 0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 15px rgba(100, 116, 139, 0.3)';
                          }}
                          title="View"
                        >
                          <FaEye size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(job)}
                          style={{
                            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '10px',
                            cursor: 'pointer',
                            color: '#ffffff',
                            boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 8px 25px rgba(245, 158, 11, 0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 15px rgba(245, 158, 11, 0.3)';
                          }}
                          title="Edit"
                        >
                          <FaEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(job._id)}
                          style={{
                            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '10px',
                            cursor: 'pointer',
                            color: '#ffffff',
                            boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 8px 25px rgba(239, 68, 68, 0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.3)';
                          }}
                          title="Delete"
                        >
                          <FaTrash size={16} />
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