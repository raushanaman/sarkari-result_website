import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { jobsAPI } from '../services/api';
import JobCard from '../components/JobCard';
import YouTubeSection from '../components/YouTubeSection';
import { FaGraduationCap, FaFileAlt, FaBriefcase, FaArrowRight, FaWhatsapp, FaSearch, FaTimes, FaSpinner, FaExternalLinkAlt, FaEye, FaMicrophone, FaMicrophoneSlash, FaTelegram, FaCircle, FaFacebook, FaInstagram, FaHandHoldingHeart } from 'react-icons/fa';

const tilePalette = [
  'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
  'linear-gradient(135deg, #374151 0%, #4b5563 100%)', 
  'linear-gradient(135deg, #4b5563 0%, #6b7280 100%)',
  'linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)',
  'linear-gradient(135deg, #1f2937 0%, #3b82f6 100%)',
  'linear-gradient(135deg, #374151 0%, #10b981 100%)',
  'linear-gradient(135deg, #4b5563 0%, #f59e0b 100%)',
  'linear-gradient(135deg, #6b7280 0%, #ef4444 100%)'
];

const quickCTAs = [];

const highlightColumnsConfig = [
  {
    id: 'results',
    title: 'Results',
    subtitle: 'Fresh merit lists + score cards',
    headerGradient: 'linear-gradient(120deg, #f43f5e 0%, #ef4444 55%, #dc2626 100%)',
    empty: 'No results available',
    icon: <FaGraduationCap size={22} />,
    viewAllLabel: 'View All Results',
    viewAllLink: '/category/result',
    ctaTint: '#fef2f2',
    ctaColor: '#b91c1c'
  },
  {
    id: 'upcomingJobs',
    title: 'Job Alerts',
    subtitle: 'Daily hiring + notifications',
    headerGradient: 'linear-gradient(120deg, #f97316 0%, #f97316 45%, #ea580c 100%)',
    empty: 'No jobs available',
    icon: <FaBriefcase size={22} />,
    viewAllLabel: 'View All Jobs',
    viewAllLink: '/category/upcoming-job',
    ctaTint: '#fff7ed',
    ctaColor: '#c2410c'
  },
  {
    id: 'admitCards',
    title: 'Admit Cards',
    subtitle: 'Instant hall ticket drops',
    headerGradient: 'linear-gradient(120deg, #10b981 0%, #059669 55%, #047857 100%)',
    empty: 'No admit cards available',
    icon: <FaFileAlt size={22} />,
    viewAllLabel: 'View All Admit Cards',
    viewAllLink: '/category/admit-card',
    ctaTint: '#ecfdf5',
    ctaColor: '#047857'
  },
  {
    id: 'sarkariYojana',
    title: 'Sarkari Yojana',
    subtitle: 'Government schemes & benefits',
    headerGradient: 'linear-gradient(120deg, #f97316 0%, #ea580c 55%, #dc2626 100%)',
    empty: 'No schemes available',
    icon: <FaHandHoldingHeart size={22} />,
    viewAllLabel: 'View All Schemes',
    viewAllLink: '/category/sarkari-yojana',
    ctaTint: '#fff7ed',
    ctaColor: '#c2410c'
  },
  {
    id: 'scholarships',
    title: 'Scholarships',
    subtitle: 'Education funding opportunities',
    headerGradient: 'linear-gradient(120deg, #8b5cf6 0%, #7c3aed 55%, #6d28d9 100%)',
    empty: 'No scholarships available',
    icon: <FaGraduationCap size={22} />,
    viewAllLabel: 'View All Scholarships',
    viewAllLink: '/category/scholarship',
    ctaTint: '#faf5ff',
    ctaColor: '#7c2d12'
  },
  {
    id: 'admissions',
    title: 'Admissions',
    subtitle: 'University & college admissions',
    headerGradient: 'linear-gradient(120deg, #06b6d4 0%, #0891b2 55%, #0e7490 100%)',
    empty: 'No admissions available',
    icon: <FaFileAlt size={22} />,
    viewAllLabel: 'View All Admissions',
    viewAllLink: '/category/admission',
    ctaTint: '#ecfeff',
    ctaColor: '#155e75'
  }
];

const truncateText = (text = '', limit = 60) => (text.length > limit ? `${text.slice(0, limit)}...` : text);

const Home = () => {
  const [jobs, setJobs] = useState({
    results: [],
    admitCards: [],
    upcomingJobs: [],
    sarkariYojana: [],
    scholarships: [],
    admissions: [],
    latest: []
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('all');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showIframe, setShowIframe] = useState(false);
  const [iframeUrl, setIframeUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const searchTimeoutRef = useRef(null);
  const recognitionRef = useRef(null);

  // Check if URL is valid
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Check if URL is safe for iframe
  const isSafeForIframe = (url) => {
    const safeHosts = ['sarkariresult.com', 'ssc.nic.in', 'upsc.gov.in', 'ibps.in', 'rbi.org.in'];
    try {
      const urlObj = new URL(url);
      return safeHosts.some(host => urlObj.hostname.includes(host));
    } catch {
      return false;
    }
  };

  // Voice search setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setSpeechSupported(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-IN'; // English (India) for better recognition
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript.trim();
        console.log('Voice transcript:', transcript);
        setSearchQuery(transcript);
        setIsListening(false);
        // Trigger search immediately after voice input
        setTimeout(() => {
          performSearch(transcript);
        }, 100);
      };
      
      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Start voice search
  const startVoiceSearch = () => {
    if (recognitionRef.current && speechSupported) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  // Stop voice search
  const stopVoiceSearch = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };
  // Open content function
  const openContent = (item) => {
    setErrorMessage('');
    
    if (item.url || item.link) {
      const targetUrl = item.url || item.link;
      
      if (isSafeForIframe(targetUrl)) {
        setIframeUrl(targetUrl);
        setShowIframe(true);
      } else {
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
      }
    } else {
      window.location.href = `/job/${item._id}`;
    }
  };
  // Enhanced search function with better matching
  const performSearch = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      setErrorMessage('');
      return;
    }

    setIsSearching(true);
    setErrorMessage('');
    
    // Check if query is a URL
    if (isValidUrl(query)) {
      setSearchResults([{
        _id: 'url-' + Date.now(),
        title: 'Open URL: ' + query,
        organization: 'Direct Link',
        url: query,
        category: 'url'
      }]);
      setShowResults(true);
      setIsSearching(false);
      return;
    }
    
    // Search in all jobs data
    const allJobs = [...jobs.results, ...jobs.admitCards, ...jobs.upcomingJobs, ...jobs.sarkariYojana, ...jobs.scholarships, ...jobs.admissions, ...jobs.latest];
    
    // Clean and normalize search query
    const cleanQuery = query.toLowerCase().trim();
    const queryWords = cleanQuery.split(/\s+/);

    // Enhanced filter with multiple matching strategies
    const filteredJobs = allJobs.filter(job => {
      const title = (job.title || '').toLowerCase();
      const organization = (job.organization || '').toLowerCase();
      const description = (job.description || '').toLowerCase();
      const category = (job.category || '').toLowerCase();
      
      // Exact phrase match
      if (title.includes(cleanQuery) || organization.includes(cleanQuery) || description.includes(cleanQuery)) {
        return true;
      }
      
      // Word-by-word match (at least 50% words should match)
      const matchingWords = queryWords.filter(word => 
        title.includes(word) || organization.includes(word) || description.includes(word) || category.includes(word)
      );
      
      return matchingWords.length >= Math.ceil(queryWords.length * 0.5);
    });

    console.log('Search Query:', cleanQuery);
    console.log('Total Jobs:', allJobs.length);
    console.log('Filtered Results:', filteredJobs.length);
    console.log('Sample Job Titles:', allJobs.slice(0, 3).map(job => job.title));

    if (filteredJobs.length === 0) {
      setErrorMessage(`No results found for "${query}". Try different keywords.`);
    }

    setSearchResults(filteredJobs.slice(0, 5));
    setShowResults(true);
    setIsSearching(false);
  }, [jobs]);

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(searchQuery);
      }, 300);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, performSearch]);

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setErrorMessage('');
      
      // Check if it's a URL
      if (isValidUrl(searchQuery)) {
        if (isSafeForIframe(searchQuery)) {
          setIframeUrl(searchQuery);
          setShowIframe(true);
        } else {
          window.open(searchQuery, '_blank', 'noopener,noreferrer');
        }
        return;
      }
      
      // Enhanced search in all data with better matching
      const allJobs = [...jobs.results, ...jobs.admitCards, ...jobs.upcomingJobs, ...jobs.sarkariYojana, ...jobs.scholarships, ...jobs.admissions, ...jobs.latest];
      
      const cleanQuery = searchQuery.toLowerCase().trim();
      const queryWords = cleanQuery.split(/\s+/);
      
      const filteredJobs = allJobs.filter(job => {
        const title = (job.title || '').toLowerCase();
        const organization = (job.organization || '').toLowerCase();
        const description = (job.description || '').toLowerCase();
        const category = (job.category || '').toLowerCase();
        
        // Exact phrase match
        if (title.includes(cleanQuery) || organization.includes(cleanQuery) || description.includes(cleanQuery)) {
          return true;
        }
        
        // Word-by-word match
        const matchingWords = queryWords.filter(word => 
          title.includes(word) || organization.includes(word) || description.includes(word) || category.includes(word)
        );
        
        return matchingWords.length >= Math.ceil(queryWords.length * 0.5);
      });
      
      if (filteredJobs.length > 0) {
        openContent(filteredJobs[0]);
      } else {
        setErrorMessage(`No results found for "${searchQuery}"`);
      }
    }
  };

  const fetchJobs = async () => {
    try {
      const [resultsRes, admitCardsRes, upcomingJobsRes, sarkariYojanaRes, scholarshipsRes, admissionsRes, latestRes] = await Promise.all([
        jobsAPI.getAllJobs('result'),
        jobsAPI.getAllJobs('admit-card'),
        jobsAPI.getAllJobs('upcoming-job'),
        jobsAPI.getAllJobs('sarkari-yojana'),
        jobsAPI.getAllJobs('scholarship'),
        jobsAPI.getAllJobs('admission'),
        jobsAPI.getAllJobs()
      ]);

      console.log('API Response:', { resultsRes, admitCardsRes, upcomingJobsRes, sarkariYojanaRes, scholarshipsRes, admissionsRes, latestRes });
      
      // Handle both response.data and response.data.data formats
      const resultsData = resultsRes.data?.data || resultsRes.data || [];
      const admitCardsData = admitCardsRes.data?.data || admitCardsRes.data || [];
      const upcomingJobsData = upcomingJobsRes.data?.data || upcomingJobsRes.data || [];
      const sarkariYojanaData = sarkariYojanaRes.data?.data || sarkariYojanaRes.data || [];
      const scholarshipsData = scholarshipsRes.data?.data || scholarshipsRes.data || [];
      const admissionsData = admissionsRes.data?.data || admissionsRes.data || [];
      const latestData = latestRes.data?.data || latestRes.data || [];
      
      setJobs({
        results: resultsData.slice(0, 20),
        admitCards: admitCardsData.slice(0, 20),
        upcomingJobs: upcomingJobsData.slice(0, 20),
        sarkariYojana: sarkariYojanaData.slice(0, 20),
        scholarships: scholarshipsData.slice(0, 20),
        admissions: admissionsData.slice(0, 20),
        latest: latestData.slice(0, 6)
      });
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs({
        results: [],
        admitCards: [],
        upcomingJobs: [],
        sarkariYojana: [],
        scholarships: [],
        admissions: [],
        latest: []
      });
    } finally {
      setLoading(false);
    }
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
    <div>
      {/* Top Section */}
      <section style={{
        padding: 'clamp(2rem, 6vw, 3rem) 0',
        textAlign: 'center',
        background: '#ffffff',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        position: 'relative',
        overflow: 'hidden'
      }} className="home-section">
        <div className="container">
          {/* Live Updates Section */}
          <div className="live-updates-section" style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 25%, #475569 50%, #64748b 75%, #94a3b8 100%)',
            borderRadius: 'clamp(12px, 4vw, 20px)',
            padding: 'clamp(8px, 2vw, 12px) 0',
            marginBottom: 'clamp(1.5rem, 4vw, 2rem)',
            overflow: 'hidden',
            position: 'relative',
            boxShadow: '0 20px 40px rgba(30, 41, 59, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(20px)',
            minHeight: 'fit-content',
            height: 'auto'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '12px',
              paddingLeft: '24px',
              marginBottom: '8px',
              position: 'relative',
              zIndex: 2
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <FaCircle size={8} style={{ color: '#9ACD32', animation: 'fastBlink 0.5s infinite' }} />
                <span style={{
                  color: '#f1f5f9',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                  animation: 'heartbeat 1.5s ease-in-out infinite'
                }}>
                  LIVE UPDATES
                </span>
              </div>
            </div>
            
            <style>{`
              @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
              }
              @keyframes fastBlink {
                0%, 50% { opacity: 1; }
                51%, 100% { opacity: 0.3; }
              }
              @keyframes heartbeat {
                0%, 100% { transform: scale(1); }
                14% { transform: scale(1.1); }
                28% { transform: scale(1); }
                42% { transform: scale(1.1); }
                70% { transform: scale(1); }
              }
              @keyframes slideMove {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50px); }
              }
              @keyframes marqueeHighlight {
                0% { transform: translateX(100%); }
                100% { transform: translateX(-100%); }
              }
              @keyframes colorPulse {
                0%, 100% { color: #ffffff; }
                50% { color: #f1f5f9; }
              }
              @keyframes bounceNew {
                0%, 100% { transform: scale(1) rotate(0deg); }
                25% { transform: scale(1.1) rotate(-2deg); }
                50% { transform: scale(1.2) rotate(2deg); }
                75% { transform: scale(1.1) rotate(-1deg); }
              }
              @keyframes marqueeLeft {
                0% { transform: translateX(100%); }
                100% { transform: translateX(-100%); }
              }
              @keyframes marqueeRight {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
              }
            `}</style>
            
            {/* Content Display - 8 Updates in 2 Rows */}
            {(() => {
              // Get all jobs from last 30 days and remove duplicates
              const allJobs = [...jobs.results, ...jobs.admitCards, ...jobs.upcomingJobs, ...jobs.sarkariYojana, ...jobs.scholarships, ...jobs.admissions, ...jobs.latest];
              
              // Remove duplicates by ID
              const uniqueJobs = allJobs.filter((job, index, self) => 
                index === self.findIndex(j => j._id === job._id)
              );
              
              const recentUpdates = uniqueJobs
                .filter(job => job.createdAt && new Date(job.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 16);
              
              if (recentUpdates.length === 0) {
                return (
                  <div style={{
                    padding: '30px 20px',
                    textAlign: 'center',
                    color: '#f1f5f9',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                  }}>
                    No new updates in the last month
                  </div>
                );
              }
              
              return (
                <div style={{
                  padding: '15px 0'
                }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}>
                    {/* Row 1 - Left to Right */}
                    <div style={{
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      position: 'relative',
                      height: '50px'
                    }}>
                      <div style={{
                        display: 'inline-flex',
                        gap: '30px',
                        animation: 'marqueeLeft 120s linear infinite',
                        alignItems: 'center'
                      }}>
                        {recentUpdates.slice(0, 8).map((job, index) => (
                          <Link
                            key={`row1-${job._id}`}
                            to={`/job/${job._id}`}
                            style={{
                              color: '#ffffff',
                              textDecoration: 'none',
                              fontSize: '0.9rem',
                              fontWeight: '800',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '8px 16px',
                              borderRadius: '10px',
                              background: 'rgba(255, 255, 255, 0.1)',
                              textShadow: '0 2px 4px rgba(0, 0, 0, 0.6)',
                              whiteSpace: 'nowrap',
                              minWidth: 'max-content'
                            }}
                          >
                            <span style={{
                              background: 'rgba(255, 0, 0, 0.9)',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '0.7rem',
                              fontWeight: '800',
                              color: '#fff',
                              animation: 'bounceNew 2s ease-in-out infinite'
                            }}>
                              🔥 NEW!
                            </span>
                            <span>{job.title}</span>
                          </Link>
                        ))}
                        {recentUpdates.slice(0, 8).map((job, index) => (
                          <Link
                            key={`row1-dup-${job._id}`}
                            to={`/job/${job._id}`}
                            style={{
                              color: '#ffffff',
                              textDecoration: 'none',
                              fontSize: '0.9rem',
                              fontWeight: '800',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '8px 16px',
                              borderRadius: '10px',
                              background: 'rgba(255, 255, 255, 0.1)',
                              textShadow: '0 2px 4px rgba(0, 0, 0, 0.6)',
                              whiteSpace: 'nowrap',
                              minWidth: 'max-content'
                            }}
                          >
                            <span style={{
                              background: 'rgba(255, 0, 0, 0.9)',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '0.7rem',
                              fontWeight: '800',
                              color: '#fff',
                              animation: 'bounceNew 2s ease-in-out infinite'
                            }}>
                              🔥 NEW!
                            </span>
                            <span>{job.title}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                    
                    {/* Row 2 - Right to Left */}
                    <div style={{
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      position: 'relative',
                      height: '50px'
                    }}>
                      <div style={{
                        display: 'inline-flex',
                        gap: '30px',
                        animation: 'marqueeRight 120s linear infinite',
                        alignItems: 'center'
                      }}>
                        {recentUpdates.slice(8, 16).map((job, index) => (
                          <Link
                            key={`row2-${job._id}`}
                            to={`/job/${job._id}`}
                            style={{
                              color: '#ffffff',
                              textDecoration: 'none',
                              fontSize: '0.9rem',
                              fontWeight: '800',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '8px 16px',
                              borderRadius: '10px',
                              background: 'rgba(255, 255, 255, 0.1)',
                              textShadow: '0 2px 4px rgba(0, 0, 0, 0.6)',
                              whiteSpace: 'nowrap',
                              minWidth: 'max-content'
                            }}
                          >
                            <span style={{
                              background: 'rgba(255, 0, 0, 0.9)',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '0.7rem',
                              fontWeight: '800',
                              color: '#fff',
                              animation: 'bounceNew 2s ease-in-out infinite'
                            }}>
                              🔥 NEW!
                            </span>
                            <span>{job.title}</span>
                          </Link>
                        ))}
                        {recentUpdates.slice(8, 16).map((job, index) => (
                          <Link
                            key={`row2-dup-${job._id}`}
                            to={`/job/${job._id}`}
                            style={{
                              color: '#ffffff',
                              textDecoration: 'none',
                              fontSize: '0.9rem',
                              fontWeight: '800',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '8px 16px',
                              borderRadius: '10px',
                              background: 'rgba(255, 255, 255, 0.1)',
                              textShadow: '0 2px 4px rgba(0, 0, 0, 0.6)',
                              whiteSpace: 'nowrap',
                              minWidth: 'max-content'
                            }}
                          >
                            <span style={{
                              background: 'rgba(255, 0, 0, 0.9)',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '0.7rem',
                              fontWeight: '800',
                              color: '#fff',
                              animation: 'bounceNew 2s ease-in-out infinite'
                            }}>
                              🔥 NEW!
                            </span>
                            <span>{job.title}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
          <div style={{
            display: 'flex',
            gap: 'clamp(0.75rem, 3vw, 1rem)',
            justifyContent: 'center',
            marginBottom: 'clamp(1.5rem, 4vw, 2rem)',
            flexWrap: 'wrap',
            padding: '0 clamp(0.5rem, 2vw, 1rem)'
          }}>
            <a
              href="https://chat.whatsapp.com/JKMhQcH0RhY44XvM3t48PI"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'clamp(0.4rem, 1.5vw, 0.5rem)',
                background: '#25D366',
                color: 'white',
                padding: 'clamp(10px, 3vw, 12px) clamp(20px, 5vw, 28px)',
                borderRadius: '999px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                boxShadow: '0 15px 35px rgba(37, 211, 102, 0.35)'
              }}
            >
              <FaWhatsapp size={20} />
              Join WhatsApp
            </a>
            
            <a
              href="https://t.me/kasimcyberworld"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'clamp(0.4rem, 1.5vw, 0.5rem)',
                background: '#0088cc',
                color: 'white',
                padding: 'clamp(10px, 3vw, 12px) clamp(20px, 5vw, 28px)',
                borderRadius: '999px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                boxShadow: '0 15px 35px rgba(0, 136, 204, 0.35)'
              }}
            >
              <FaTelegram size={20} />
              Join Telegram
            </a>
            
            <a
              href="https://www.facebook.com/share/1EVdSkMWpQ/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'clamp(0.4rem, 1.5vw, 0.5rem)',
                background: '#1877f2',
                color: 'white',
                padding: 'clamp(10px, 3vw, 12px) clamp(20px, 5vw, 28px)',
                borderRadius: '999px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                boxShadow: '0 15px 35px rgba(24, 119, 242, 0.35)'
              }}
            >
              <FaFacebook size={20} />
              Join Facebook
            </a>
            
            <a
              href="https://www.instagram.com/mds_kasim_786?igsh=YnptdDh4dzdlc3Jz"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'clamp(0.4rem, 1.5vw, 0.5rem)',
                background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
                color: 'white',
                padding: 'clamp(10px, 3vw, 12px) clamp(20px, 5vw, 28px)',
                borderRadius: '999px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                boxShadow: '0 15px 35px rgba(240, 148, 51, 0.35)'
              }}
            >
              <FaInstagram size={20} />
              Join Instagram
            </a>
          </div>

          {/* Modern Animated Search Bar */}
          <div style={{
            maxWidth: 'clamp(300px, 90vw, 1000px)',
            margin: '0 auto clamp(1rem, 3vw, 1.5rem)',
            position: 'relative',
            padding: '0 clamp(0.5rem, 2vw, 1rem)'
          }}>
            <div style={{
              borderRadius: 'clamp(20px, 6vw, 30px)',
              padding: 'clamp(4px, 1.5vw, 6px)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(40px)',
              border: '2px solid transparent',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85)) padding-box, linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(16, 185, 129, 0.3)) border-box',
              height: 'clamp(50px, 12vw, 70px)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              animation: 'searchBarFloat 6s ease-in-out infinite'
            }}>
              <style>{`
                @keyframes searchBarFloat {
                  0%, 100% { transform: translateY(0px); }
                  50% { transform: translateY(-2px); }
                }
                @keyframes pulseGlow {
                  0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
                  50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.5); }
                }
                @keyframes shimmer {
                  0% { background-position: -200% 0; }
                  100% { background-position: 200% 0; }
                }
                .search-input {
                  background: linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.1) 50%, transparent 100%);
                  background-size: 200% 100%;
                  animation: shimmer 3s ease-in-out infinite;
                }
                .search-input:focus {
                  animation: none;
                  background: transparent;
                }
              `}</style>
              <form onSubmit={handleSearch} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                height: '100%'
              }}>
                <div style={{
                  flex: 1,
                  position: 'relative',
                  height: 'clamp(40px, 10vw, 58px)'
                }}>
                  <input
                    type="text"
                    placeholder="Search or speak..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                    style={{
                      width: '100%',
                      height: '100%',
                      padding: 'clamp(12px, 4vw, 18px) clamp(16px, 5vw, 24px)',
                      paddingRight: speechSupported ? (searchQuery ? 'clamp(120px, 25vw, 160px)' : 'clamp(90px, 20vw, 120px)') : (searchQuery ? 'clamp(80px, 18vw, 110px)' : 'clamp(60px, 15vw, 80px)'),
                      border: 'none',
                      borderRadius: 'clamp(16px, 4vw, 24px)',
                      fontSize: 'clamp(0.9rem, 3vw, 1.1rem)',
                      fontWeight: '500',
                      background: 'rgba(255, 255, 255, 0.8)',
                      outline: 'none',
                      color: '#1e293b',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      backdropFilter: 'blur(10px)'
                    }}
                    onFocus={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.95)';
                      e.target.style.transform = 'scale(1.02)';
                      e.target.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.8)';
                      e.target.style.transform = 'scale(1)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  
                  {/* Clear Button */}
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      style={{
                        position: 'absolute',
                        right: speechSupported ? '110px' : '70px',
                        top: '50%',
                        transform: 'translateY(-50%) scale(0)',
                        background: 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'white',
                        padding: '8px',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                        animation: 'scaleIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
                        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-50%) scale(1.1)';
                        e.target.style.boxShadow = '0 6px 20px rgba(239, 68, 68, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(-50%) scale(1)';
                        e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                      }}
                    >
                      <style>{`
                        @keyframes scaleIn {
                          from { transform: translateY(-50%) scale(0); }
                          to { transform: translateY(-50%) scale(1); }
                        }
                      `}</style>
                      <FaTimes size={14} />
                    </button>
                  )}
                  
                  {/* Search Button - Animated */}
                  <button
                    type="submit"
                    disabled={isSearching}
                    style={{
                      position: 'absolute',
                      right: speechSupported ? '68px' : '24px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      padding: '10px',
                      background: isSearching 
                        ? 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)'
                        : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      cursor: isSearching ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
                      width: '40px',
                      height: '40px',
                      animation: isSearching ? 'pulseGlow 2s ease-in-out infinite' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSearching) {
                        e.target.style.transform = 'translateY(-50%) scale(1.1) rotate(5deg)';
                        e.target.style.boxShadow = '0 12px 35px rgba(59, 130, 246, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSearching) {
                        e.target.style.transform = 'translateY(-50%) scale(1) rotate(0deg)';
                        e.target.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.3)';
                      }
                    }}
                  >
                    {isSearching ? <FaSpinner className="fa-spin" size={14} /> : <FaSearch size={14} />}
                  </button>
                  
                  {/* Voice Search Button - Animated */}
                  {speechSupported && (
                    <button
                      type="button"
                      onClick={isListening ? stopVoiceSearch : startVoiceSearch}
                      style={{
                        position: 'absolute',
                        right: '20px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: isListening 
                          ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' 
                          : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'white',
                        padding: '10px',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: isListening 
                          ? '0 0 30px rgba(239, 68, 68, 0.6)' 
                          : '0 8px 25px rgba(16, 185, 129, 0.3)',
                        animation: isListening ? 'pulseGlow 1s ease-in-out infinite' : 'none'
                      }}
                      title={isListening ? 'Stop listening' : 'Start voice search'}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-50%) scale(1.1)';
                        e.target.style.boxShadow = isListening 
                          ? '0 0 40px rgba(239, 68, 68, 0.8)' 
                          : '0 12px 35px rgba(16, 185, 129, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(-50%) scale(1)';
                        e.target.style.boxShadow = isListening 
                          ? '0 0 30px rgba(239, 68, 68, 0.6)' 
                          : '0 8px 25px rgba(16, 185, 129, 0.3)';
                      }}
                    >
                      {isListening ? <FaMicrophoneSlash size={14} /> : <FaMicrophone size={14} />}
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Real-time Search Results */}
            {showResults && searchResults.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: '#000000',
                borderRadius: '0 0 20px 20px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                backdropFilter: 'blur(30px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderTop: 'none',
                zIndex: 1000,
                maxHeight: '400px',
                overflowY: 'auto'
              }}>
                <div style={{ padding: '16px 20px 8px', fontSize: '0.9rem', color: '#ffffff', fontWeight: '600' }}>
                  Quick Results ({searchResults.length})
                </div>
                {searchResults.map((result, index) => {
                  let categoryInfo = { label: 'Job', color: '#3b82f6' };
                  if (result.category === 'url') {
                    categoryInfo = { label: 'URL', color: '#8b5cf6' };
                  } else if (jobs.results.includes(result)) {
                    categoryInfo = { label: 'Result', color: '#ef4444' };
                  } else if (jobs.admitCards.includes(result)) {
                    categoryInfo = { label: 'Admit Card', color: '#10b981' };
                  } else if (jobs.upcomingJobs.includes(result)) {
                    categoryInfo = { label: 'Job', color: '#f97316' };
                  } else if (jobs.sarkariYojana.includes(result)) {
                    categoryInfo = { label: 'Sarkari Yojana', color: '#ea580c' };
                  } else if (jobs.scholarships.includes(result)) {
                    categoryInfo = { label: 'Scholarship', color: '#8b5cf6' };
                  } else if (jobs.admissions.includes(result)) {
                    categoryInfo = { label: 'Admission', color: '#06b6d4' };
                  }
                  
                  return (
                    <div
                      key={result._id}
                      onClick={() => openContent(result)}
                      style={{
                        padding: '12px 20px',
                        cursor: 'pointer',
                        borderBottom: index < searchResults.length - 1 ? '1px solid rgba(226, 232, 240, 0.5)' : 'none',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: '12px'
                      }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '600', fontSize: '0.95rem', marginBottom: '4px', color: '#ffffff' }}>
                            {truncateText(result.title, 70)}
                          </div>
                          <div style={{ fontSize: '0.85rem', color: '#cccccc' }}>
                            {result.organization}
                            {result.posts && ` • ${result.posts} Posts`}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{
                            background: categoryInfo.color,
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            whiteSpace: 'nowrap'
                          }}>
                            {categoryInfo.label}
                          </span>
                          {result.url && (
                            <FaExternalLinkAlt size={12} style={{ color: '#cccccc' }} />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {/* Error Message */}
            {errorMessage && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: '#000000',
                borderRadius: '0 0 20px 20px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                backdropFilter: 'blur(30px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderTop: 'none',
                zIndex: 1000,
                padding: '20px',
                textAlign: 'center'
              }}>
                <div style={{ color: '#ef4444', fontSize: '0.9rem', fontWeight: '500' }}>
                  {errorMessage}
                </div>
              </div>
            )}
          </div>

          {/* Dynamic Job Cards Grid */}
          <div className="job-cards-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(250px, 30vw, 320px), 1fr))',
            gap: 'clamp(0.5rem, 1.5vw, 1.2rem)',
            marginBottom: '3rem',
            gridAutoRows: '1fr'
          }}>
            {jobs.latest.map((job, index) => (
              <Link
                key={job._id}
                to={`/job/${job._id}`}
                style={{ textDecoration: 'none', display: 'block', height: '100%' }}
              >
                <div
                  className="job-card"
                  style={{
                    background: tilePalette[index % tilePalette.length],
                    color: '#ffffff',
                    padding: '1.25rem',
                    borderRadius: '16px',
                    textAlign: 'left',
                    fontWeight: '600',
                    fontSize: 'clamp(0.8rem, 2vw, 0.95rem)',
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    backdropFilter: 'blur(10px)',
                    textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
                    minHeight: 'clamp(90px, 12vw, 120px)'
                  }}
                  onMouseEnter={(event) => {
                    event.currentTarget.style.transform = 'translateY(-8px) scale(1.05)';
                    event.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.4), 0 0 30px rgba(255, 176, 124, 0.4)';
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.transform = 'translateY(0) scale(1)';
                    event.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
                  }}
                >
                  <div>
                    {job.title.length > 60 ? `${job.title.substring(0, 60)}...` : job.title}
                    <br />
                    <span style={{
                      fontSize: '0.85rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      marginTop: '0.4rem',
                      color: 'rgba(255, 255, 255, 0.9)'
                    }}>
                      <FaArrowRight /> {job.organization}
                      {job.posts && ` • ${job.posts} Posts`}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>


        </div>
      </section>

      {/* Single Continuous Cards Section */}
      <section style={{ padding: '3rem 0', background: 'var(--color-surface)' }}>
        <div className="container">
          <div className="all-cards-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1rem',
            justifyContent: 'center',
            alignItems: 'stretch'
          }}>
            {highlightColumnsConfig.map((column) => {
              const columnJobs = jobs[column.id] || [];
              const hasJobs = columnJobs.length > 0;
              return (
                <div key={column.id} className="status-card">
                  <div className="status-card__header" style={{ background: column.headerGradient }}>
                    <div className="status-card__title">
                      <span className="status-card__icon">
                        {column.icon}
                      </span>
                      <div>
                        <p>{column.title}</p>
                      </div>
                    </div>
                    <span className="status-card__count" title={`${columnJobs.length} total`}>{columnJobs.length > 20 ? '20+' : columnJobs.length}</span>
                  </div>

                  <div className={`status-card__body${hasJobs ? '' : ' status-card__body--empty'}`}>
                    {hasJobs ? (
                      <ul className="status-card__list">
                        {columnJobs.slice(0, 20).map((job) => (
                          <li key={job._id}>
                            <Link to={`/job/${job._id}`}>
                              {truncateText(job.title)}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="status-card__empty">{column.empty}</p>
                    )}
                  </div>

                  <Link
                    to={column.viewAllLink}
                    className="status-card__cta"
                    style={{ background: column.ctaTint, color: column.ctaColor || 'var(--color-text)' }}
                  >
                    {column.viewAllLabel}
                    <FaArrowRight size={16} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* YouTube Section */}
      <YouTubeSection />

      {/* Iframe Modal */}
      {showIframe && (
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
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            width: '100%',
            height: '100%',
            maxWidth: '1200px',
            maxHeight: '800px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ fontWeight: '600', color: '#1e293b' }}>
                {iframeUrl}
              </div>
              <button
                onClick={() => setShowIframe(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  color: '#64748b'
                }}
              >
                <FaTimes size={16} />
              </button>
            </div>
            <iframe
              src={iframeUrl}
              style={{
                flex: 1,
                border: 'none',
                width: '100%'
              }}
              title="Content Viewer"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;