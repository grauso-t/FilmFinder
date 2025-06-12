import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const handleCardClick = () => {
    navigate(`/film/${movie.id}`);
  };

  const styles = {
    card: {
      backgroundColor: 'rgba(31, 41, 55, 0.8)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      border: '1px solid rgba(55, 65, 81, 0.5)',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    },
    poster: {
      width: '100%',
      height: '350px',
      objectFit: 'cover',
      display: imageError ? 'none' : 'block',
      transition: 'transform 0.4s ease',
    },
    placeholder: {
      width: '100%',
      height: '350px',
      background: 'linear-gradient(135deg, #374151 0%, #4b5563 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#d1d5db',
      fontSize: '14px',
      fontWeight: '500',
      textAlign: 'center',
      padding: '1rem',
    },
    info: {
      padding: '1.25rem',
      background: 'linear-gradient(to bottom, rgba(31, 41, 55, 0.9), rgba(17, 24, 39, 0.9))',
    },
    title: {
      color: '#ffffff',
      fontWeight: '600',
      fontSize: '1rem',
      lineHeight: '1.4',
      margin: 0,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.7) 100%)',
      opacity: 0,
      transition: 'opacity 0.4s ease',
      pointerEvents: 'none',
    }
  };

  return (
    <div 
      style={styles.card} 
      onClick={handleCardClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
        e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)';
        const overlay = e.currentTarget.querySelector('.card-overlay');
        if (overlay) overlay.style.opacity = '1';
        const poster = e.currentTarget.querySelector('img');
        if (poster) poster.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
        e.currentTarget.style.borderColor = 'rgba(55, 65, 81, 0.5)';
        const overlay = e.currentTarget.querySelector('.card-overlay');
        if (overlay) overlay.style.opacity = '0';
        const poster = e.currentTarget.querySelector('img');
        if (poster) poster.style.transform = 'scale(1)';
      }}
    >
      <div className="card-overlay" style={styles.overlay}></div>
      {!imageError && movie.cover_url ? (
        <img 
          src={movie.cover_url} 
          alt={movie.title} 
          style={styles.poster} 
          onError={() => setImageError(true)} 
        />
      ) : (
        <div style={styles.placeholder}>
          <span>{movie.title}</span>
        </div>
      )}
      <div style={styles.info}>
        <h3 style={styles.title}>{movie.title}</h3>
      </div>
    </div>
  );
};

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      const parsedUser = JSON.parse(loggedInUser);
      setUser(parsedUser);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (user && user.id) {
      const fetchFavorites = async () => {
        try {
          setLoading(true);
          const response = await fetch(`http://127.0.0.1:5000/api/users/${user.id}/favorites`);
          
          if (!response.ok) {
            throw new Error('Errore nel recupero dei film preferiti');
          }
          
          const data = await response.json();
          setFavoriteMovies(data.favorite_movies || []);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchFavorites();
    }
  }, [user]);

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #111827 0%, #1f2937 50%, #111827 100%)',
      color: '#ffffff',
      padding: '2rem',
      fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
      position: 'relative',
    },
    backgroundPattern: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.03,
      backgroundImage: `radial-gradient(circle at 20% 80%, rgba(120, 113, 255, 0.3) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(255, 107, 161, 0.3) 0%, transparent 50%),
                        radial-gradient(circle at 40% 40%, rgba(99, 102, 241, 0.2) 0%, transparent 50%)`,
      pointerEvents: 'none',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '3rem',
      paddingBottom: '2rem',
      borderBottom: '1px solid rgba(55, 65, 81, 0.3)',
      position: 'relative',
      zIndex: 1,
    },
    title: {
      fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
      fontWeight: '700',
      background: 'linear-gradient(135deg, #ffffff 0%, #d1d5db 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      letterSpacing: '-0.02em',
    },
    backButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      background: 'linear-gradient(135deg, #374151 0%, #4b5563 100%)',
      border: 'none',
      color: '#ffffff',
      fontSize: '16px',
      fontWeight: '500',
      cursor: 'pointer',
      padding: '12px 20px',
      borderRadius: '12px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(55, 65, 81, 0.5)',
    },
    content: {
      position: 'relative',
      zIndex: 1,
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '2rem',
      marginTop: '2rem',
    },
    message: {
      color: '#d1d5db',
      fontSize: '1.2rem',
      fontWeight: '500',
      marginTop: '4rem',
      textAlign: 'center',
      opacity: 0.8,
    },
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      gap: '1rem',
    },
    spinner: {
      width: '40px',
      height: '40px',
      border: '3px solid rgba(255, 255, 255, 0.1)',
      borderTop: '3px solid #6366f1',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    statsContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '2rem',
      marginBottom: '2rem',
      padding: '1.5rem',
      background: 'rgba(31, 41, 55, 0.5)',
      borderRadius: '16px',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(55, 65, 81, 0.3)',
    },
    stat: {
      textAlign: 'center',
    },
    statNumber: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#6366f1',
      display: 'block',
    },
    statLabel: {
      fontSize: '0.9rem',
      color: '#9ca3af',
      fontWeight: '500',
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.backgroundPattern}></div>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <h2 style={styles.message}>Caricamento profilo...</h2>
        </div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.backgroundPattern}></div>
        <div style={styles.loadingContainer}>
          <h2 style={styles.message}>Errore: {error}</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.backgroundPattern}></div>
      
      <header style={styles.header}>
        {user && <h1 style={styles.title}>Preferiti di {user.username}</h1>}
        <button 
          style={styles.backButton}
          onClick={() => navigate('/home')}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
            e.target.style.background = 'linear-gradient(135deg, #4b5563 0%, #6b7280 100%)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
            e.target.style.background = 'linear-gradient(135deg, #374151 0%, #4b5563 100%)';
          }}
        >
          ← Torna alla Home
        </button>
      </header>

      <div style={styles.content}>
        {favoriteMovies.length > 0 && (
          <div style={styles.statsContainer}>
            <div style={styles.stat}>
              <span style={styles.statNumber}>{favoriteMovies.length}</span>
              <span style={styles.statLabel}>Film Preferiti</span>
            </div>
          </div>
        )}

        {favoriteMovies.length > 0 ? (
          <div style={styles.grid}>
            {favoriteMovies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div style={{textAlign: 'center', marginTop: '4rem'}}>
            <div style={{
              fontSize: '4rem',
              opacity: 0.3,
              marginBottom: '1rem'
            }}>🎬</div>
            <p style={styles.message}>Non hai ancora aggiunto nessun film ai preferiti.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;