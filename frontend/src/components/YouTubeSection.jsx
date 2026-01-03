import { useState, useEffect } from 'react';
import { FaYoutube, FaPlay } from 'react-icons/fa';
import { youtubeAPI } from '../services/api';

const YouTubeSection = () => {
  const [youtubeData, setYoutubeData] = useState({
    channelUrl: 'https://www.youtube.com/watch?v=3CkgSQWwNlk'
  });

  const getVideoId = (url) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  const getThumbnailUrl = (videoUrl) => {
    const videoId = getVideoId(videoUrl);
    return videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : 'https://i.ytimg.com/vi/T55Kb8rrH1g/hqdefault.jpg';
  };

  useEffect(() => {
    fetchYouTubeData();
  }, []);

  const fetchYouTubeData = async () => {
    try {
      const response = await youtubeAPI.getYouTubeUpdate();
      if (response.data.success && response.data.data) {
        setYoutubeData({
          channelUrl: response.data.data.channelUrl
        });
      }
    } catch (error) {
      console.error('Error fetching YouTube data:', error);
    }
  };

  return (
    <section className="youtube-section" style={{
      padding: '4rem 0',
      background: 'linear-gradient(135deg, #2d3748 0%, #1a202c 25%, #4a5568 50%, #2d3748 75%, #1a1a1a 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 8s ease-in-out infinite',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '24px',
      margin: '3rem 0',
      textAlign: 'center',
      boxShadow: '0 25px 80px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 40%),
          radial-gradient(circle at 90% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 40%),
          radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),
          linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.05) 50%, transparent 70%)
        `,
        animation: 'float 6s ease-in-out infinite',
        pointerEvents: 'none'
      }} />
      
      {/* Glowing Orbs */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '15%',
        width: '100px',
        height: '100px',
        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'pulse 4s ease-in-out infinite',
        pointerEvents: 'none'
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '30%',
        right: '20%',
        width: '80px',
        height: '80px',
        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'pulse 3s ease-in-out infinite reverse',
        pointerEvents: 'none'
      }} />
      
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header Section */}
        <div style={{
          marginBottom: '3rem'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '1rem',
            background: 'linear-gradient(135deg, #ff0000 0%, #cc0000 100%)',
            padding: '1rem 2rem',
            borderRadius: '50px',
            marginBottom: '1.5rem',
            boxShadow: '0 8px 25px rgba(255, 0, 0, 0.3)'
          }}>
            <FaYoutube size={28} style={{ color: '#ffffff' }} />
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#ffffff',
              margin: 0
            }}>
              YouTube Channel
            </h2>
          </div>
          
          <p style={{
            fontSize: '1.2rem',
            color: '#000000',
            marginBottom: '0',
            maxWidth: '650px',
            margin: '0 auto',
            lineHeight: '1.6',
            fontWeight: '500'
          }}>
            Subscribe to our YouTube channel for video tutorials, exam tips, and latest updates!
          </p>
        </div>

        {/* Video Section */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2.5rem',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          {/* YouTube Thumbnail */}
          <div style={{
            position: 'relative',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)',
            cursor: 'pointer',
            transition: 'all 0.4s ease',
            border: '3px solid #ffffff'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 35px 70px rgba(0, 0, 0, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.2)';
          }}
          onClick={() => window.open(youtubeData.channelUrl, '_blank')}
          >
            <img 
              key={youtubeData.channelUrl}
              src={getThumbnailUrl(youtubeData.channelUrl)}
              alt="YouTube Channel"
              style={{
                width: '100%',
                height: '320px',
                objectFit: 'cover',
                display: 'block'
              }}
            />
            {/* Play Button Overlay */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'linear-gradient(135deg, #ff0000 0%, #cc0000 100%)',
              borderRadius: '50%',
              width: '80px',
              height: '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 25px rgba(255, 0, 0, 0.4)',
              border: '4px solid rgba(255, 255, 255, 0.9)'
            }}>
              <FaPlay size={28} style={{ color: 'white', marginLeft: '6px' }} />
            </div>
            
            {/* Gradient Overlay */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '100px',
              background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.3))',
              pointerEvents: 'none'
            }} />
          </div>

          {/* CTA Button */}
          <a
            href={youtubeData.channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '1.2rem',
              fontWeight: '600',
              padding: '16px 40px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'linear-gradient(135deg, #ff0000 0%, #cc0000 100%)',
              color: '#ffffff',
              textDecoration: 'none',
              borderRadius: '50px',
              boxShadow: '0 12px 30px rgba(255, 0, 0, 0.3)',
              transition: 'all 0.3s ease',
              border: 'none',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 18px 40px rgba(255, 0, 0, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 12px 30px rgba(255, 0, 0, 0.3)';
            }}
          >
            <FaYoutube size={20} />
            Visit YouTube Channel
          </a>
        </div>
      </div>
    </section>
  );
};

export default YouTubeSection;