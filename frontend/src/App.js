import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const FilmFinder = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const goToFilmPage = (filmId) => {
    navigate(`/film/${filmId}`);
  };

  const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8"></circle>
      <path d="m21 21-4.35-4.35"></path>
    </svg>
  );

  const UserIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );

  const FilmIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect width="18" height="18" x="3" y="3" rx="2"></rect>
      <path d="M7 3v18"></path><path d="M3 7.5h4"></path><path d="M3 12h18"></path><path d="M3 16.5h4"></path>
      <path d="M17 3v18"></path><path d="M17 7.5h4"></path><path d="M17 16.5h4"></path>
    </svg>
  );

  const StarIcon = ({ filled = false }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "#fbbf24" : "none"} stroke="#fbbf24" strokeWidth="2">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
    </svg>
  );

  const TrendingIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="22,7 13.5,15.5 8.5,10.5 2,17"></polyline>
      <polyline points="16,7 22,7 22,13"></polyline>
    </svg>
  );

  const AwardIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="6"></circle>
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path>
    </svg>
  );

  const CalendarIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );

  const HeartIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
  );
  
  const GhostIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5.5 12.5c0-2.48 2.02-4.5 4.5-4.5s4.5 2.02 4.5 4.5v.5h-9v-.5z"></path>
        <path d="M18 10h.5a2.5 2.5 0 0 1 0 5h-.5v6H6v-6H5.5a2.5 2.5 0 0 1 0-5H6V9a6 6 0 0 1 6-6c2.05 0 3.9.99 5.12 2.55"></path>
        <path d="M10 16v-1"></path><path d="M14 16v-1"></path>
    </svg>
  );

  const SparklesIcon = () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9.5 2.5l1.5 3 3.5.5-2.5 2.5.5 3.5-3-1.5-3 1.5.5-3.5-2.5-2.5 3.5-.5zM18 13l-1.5-3-3.5-.5 2.5-2.5-.5-3.5 3 1.5 3-1.5-.5 3.5 2.5 2.5-3.5.5z"></path>
        <path d="m22 18-1-1-1 1-1-1-1 1-1-1-1 1"></path>
        <path d="m14 22 1-1 1 1 1-1 1 1 1-1 1 1"></path>
      </svg>
  );

  const HomeIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
  );

  const ComedyMaskIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
      <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
      <line x1="9" y1="9" x2="9.01" y2="9"></line>
      <line x1="15" y1="9" x2="15.01" y2="9"></line>
    </svg>
  );
  
  useEffect(() => {
    const userJSON = localStorage.getItem('user');

    if (userJSON) {
      try {
        setUser(JSON.parse(userJSON));
      } catch (err) {
        console.error('Error parsing user data:', err);
        localStorage.removeItem('user');
        navigate('/login');
      }
    }
  }, [navigate]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://127.0.0.1:5000/api/movies/');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.data) {
          setMovies(data.data);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching movies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const transformMovieData = (movie) => ({
    id: movie.id,
    title: movie.title,
    image: movie.cover_url || '/api/placeholder/200/300',
    year: movie.release_year,
    rating: movie.imdb_score || movie.tmdb_score || 'N/A',
    genres: movie.genres ? JSON.parse(movie.genres.replace(/'/g, '"')) : [],
    description: movie.description
  });

  const getMoviesByCategory = (category, limit = 10) => {
    if (!movies.length) return [];
    
    let filtered = [];
    
    switch (category) {
      case 'top_rated':
        filtered = movies
          .filter(movie => movie.imdb_score && movie.imdb_score >= 7.5)
          .sort((a, b) => (b.imdb_score || 0) - (a.imdb_score || 0));
        break;
      case 'trending':
        filtered = movies
          .filter(movie => movie.tmdb_popularity && movie.tmdb_popularity > 100)
          .sort((a, b) => (b.tmdb_popularity || 0) - (a.tmdb_popularity || 0));
        break;
      case 'action':
        filtered = movies.filter(movie => 
          movie.genres && movie.genres.toLowerCase().includes('action')
        );
        break;
      case 'drama':
        filtered = movies.filter(movie => 
          movie.genres && movie.genres.toLowerCase().includes('drama')
        );
        break;
      case 'romance':
        filtered = movies.filter(movie => 
          movie.genres && movie.genres.toLowerCase().includes('romance')
        );
        break;
      case 'horror':
        filtered = movies.filter(movie => 
          movie.genres && movie.genres.toLowerCase().includes('horror')
        );
        break;
      case 'animation':
        filtered = movies.filter(movie => 
          movie.genres && movie.genres.toLowerCase().includes('animation')
        );
        break;
      case 'family':
        filtered = movies.filter(movie => 
          movie.genres && movie.genres.toLowerCase().includes('family')
        );
        break;
      case 'comedy':
        filtered = movies.filter(movie => 
          movie.genres && movie.genres.toLowerCase().includes('comedy')
        );
        break;
      default:
        filtered = movies;
    }
    
    return filtered.slice(0, limit).map(transformMovieData);
  };

  const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#111827',
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    header: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #374151',
        padding: '1rem 0'
    },
    headerContent: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    logoContainer: {
        display: 'flex',
        alignItems: 'center'
    },
    logoIcon: {
        width: '40px',
        height: '40px',
        background: 'linear-gradient(135deg, #dc2626, #991b1b)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
        position: 'relative'
    },
    logoAccent: {
        position: 'absolute',
        top: '-4px',
        right: '-4px',
        width: '16px',
        height: '16px',
        backgroundColor: '#fbbf24',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    logoAccentDot: {
        width: '8px',
        height: '8px',
        backgroundColor: '#111827',
        borderRadius: '50%'
    },
    logoText: {
        marginLeft: '12px',
        fontSize: '24px',
        fontWeight: 'bold',
        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
    },
    searchContainer: {
        flex: 1,
        maxWidth: '400px',
        margin: '0 2rem',
        position: 'relative'
    },
    searchInput: {
        width: '100%',
        backgroundColor: '#374151',
        color: '#ffffff',
        border: 'none',
        borderRadius: '24px',
        padding: '12px 16px 12px 48px',
        fontSize: '14px',
        outline: 'none',
        transition: 'all 0.3s ease'
    },
    searchIcon: {
        position: 'absolute',
        left: '16px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#9ca3af'
    },
    userButton: {
        width: '40px',
        height: '40px',
        background: 'linear-gradient(135deg, #4b5563, #374151)',
        borderRadius: '50%',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.3s ease',
        color: '#ffffff'
    },
    heroSection: {
        marginTop: '80px',
        padding: '3rem 1rem',
        maxWidth: '1200px',
        margin: '80px auto 0'
    },
    heroCard: {
        background: 'linear-gradient(135deg, rgba(127, 29, 29, 0.2), rgba(88, 28, 135, 0.2))',
        borderRadius: '16px',
        padding: '3rem',
        marginBottom: '3rem',
        backdropFilter: 'blur(8px)',
        border: '1px solid #374151'
    },
    heroTitle: {
        fontSize: '3rem',
        fontWeight: 'bold',
        marginBottom: '1rem',
        lineHeight: '1.1'
    },
    heroSubtitle: {
        display: 'block',
        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
    },
    heroDescription: {
        color: '#d1d5db',
        fontSize: '18px',
        maxWidth: '600px',
        lineHeight: '1.6'
    },
    sectionsContainer: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem 3rem'
    },
    sectionHeader: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '1.5rem'
    },
    sectionIcon: {
        color: '#ef4444',
        marginRight: '12px'
    },
    sectionTitle: {
        fontSize: '24px',
        fontWeight: 'bold'
    },
    filmsRow: {
        display: 'flex',
        overflowX: 'auto',
        gap: '1rem',
        paddingBottom: '1rem',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
    },
    filmCard: {
        flexShrink: 0,
        cursor: 'pointer',
        transition: 'transform 0.3s ease',
        position: 'relative'
    },
    filmCardHover: {
        transform: 'scale(1.05)'
    },
    filmImage: {
        width: '200px',
        height: '300px',
        backgroundColor: '#374151',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
        overflow: 'hidden',
        position: 'relative'
    },
    filmImg: {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
    },
    filmOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.8))',
        padding: '1rem',
        transform: 'translateY(100%)',
        transition: 'transform 0.3s ease'
    },
    filmOverlayVisible: {
        transform: 'translateY(0)'
    },
    filmTitle: {
        fontSize: '14px',
        fontWeight: '600',
        marginBottom: '0.5rem',
        color: '#ffffff'
    },
    filmMeta: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '12px',
        color: '#d1d5db'
    },
    filmRating: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
    },
    loadingContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px',
        fontSize: '18px',
        color: '#9ca3af'
    },
    errorContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px',
        fontSize: '18px',
        color: '#ef4444',
        textAlign: 'center'
    },
    footer: {
        backgroundColor: '#0f172a',
        borderTop: '1px solid #374151',
        padding: '2rem 0',
        textAlign: 'center'
    },
    footerLogo: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1rem'
    },
    footerLogoIcon: {
        width: '32px',
        height: '32px',
        background: 'linear-gradient(135deg, #dc2626, #991b1b)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '8px'
    },
    footerText: {
        color: '#9ca3af'
    }
  };

  const FilmCard = ({ film }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [imageError, setImageError] = useState(false);

    const handleImageError = () => {
        setImageError(true);
    };

    const handleClick = () => {
        goToFilmPage(film.id);
    };

    return (
        <div 
        style={{
            ...styles.filmCard,
            ...(isHovered ? styles.filmCardHover : {})
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        >
        <div style={styles.filmImage}>
            {!imageError && film.image !== '/api/placeholder/200/300' ? (
            <img 
                src={film.image}
                alt={film.title}
                style={styles.filmImg}
                onError={handleImageError}
            />
            ) : (
            <div style={{
                ...styles.filmImg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#374151',
                color: '#9ca3af',
                fontSize: '14px',
                textAlign: 'center',
                padding: '1rem'
            }}>
                <FilmIcon />
            </div>
            )}
            <div style={{
            ...styles.filmOverlay,
            ...(isHovered ? styles.filmOverlayVisible : {})
            }}>
            <h3 style={styles.filmTitle}>{film.title}</h3>
            <div style={styles.filmMeta}>
                <span>{film.year}</span>
                <div style={styles.filmRating}>
                <StarIcon filled />
                <span>{typeof film.rating === 'number' ? film.rating.toFixed(1) : film.rating}</span>
                </div>
            </div>
            </div>
        </div>
        </div>
    );
  };

  const FilmSection = ({ title, films, icon: Icon }) => (
    <div style={{ marginBottom: '3rem' }}>
        <div style={styles.sectionHeader}>
        <div style={styles.sectionIcon}>
            <Icon />
        </div>
        <h2 style={styles.sectionTitle}>{title}</h2>
        </div>
        {films.length > 0 ? (
        <div style={styles.filmsRow}>
            {films.map((film) => (
            <FilmCard key={film.id} film={film} />
            ))}
        </div>
        ) : (
        <div style={styles.loadingContainer}>
            Nessun film trovato in questa categoria
        </div>
        )}
    </div>
  );

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          Caricamento film...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <div>
            <h2>Errore nel caricamento dei film</h2>
            <p>{error}</p>
            <p>Assicurati che il server API sia in esecuzione su http://127.0.0.1:5000</p>
          </div>
        </div>
      </div>
    );
  }

  const topFilms = getMoviesByCategory('top_rated');
  const trendingFilms = getMoviesByCategory('trending');
  const actionFilms = getMoviesByCategory('action');
  const dramaFilms = getMoviesByCategory('drama');
  const romanceFilms = getMoviesByCategory('romance');
  const horrorFilms = getMoviesByCategory('horror');
  const animationFilms = getMoviesByCategory('animation');
  const familyFilms = getMoviesByCategory('family');
  const comedyFilms = getMoviesByCategory('comedy');

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logoContainer}>
            <div style={styles.logoIcon}>
              <FilmIcon />
              <div style={styles.logoAccent}>
                <div style={styles.logoAccentDot}></div>
              </div>
            </div>
            <span style={styles.logoText}>FilmFinder</span>
          </div>

          <div style={styles.searchContainer}>
            <div style={styles.searchIcon}>
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Cerca film, attori, registi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          <button
            style={styles.userButton}
            onClick={() => user ? navigate('/profile') : navigate('/login')}
          >
            <UserIcon />
          </button>
        </div>
      </header>

      <div style={styles.heroSection}>
        <div style={styles.heroCard}>
          <h1 style={styles.heroTitle}>
            Scopri il tuo
            <span style={styles.heroSubtitle}> prossimo film</span>
          </h1>
          <p style={styles.heroDescription}>
            Esplora migliaia di film, dalle ultime uscite ai grandi classici. 
            FilmFinder ti aiuta a trovare esattamente quello che stai cercando.
          </p>
        </div>
      </div>

      <div style={styles.sectionsContainer}>
        <FilmSection title="Film Top Rated" films={topFilms} icon={AwardIcon} />
        <FilmSection title="Trending Ora" films={trendingFilms} icon={TrendingIcon} />
        <FilmSection title="Film Commedia" films={comedyFilms} icon={ComedyMaskIcon} />
        <FilmSection title="Film d'Azione" films={actionFilms} icon={FilmIcon} />
        <FilmSection title="Film d'Amore" films={romanceFilms} icon={HeartIcon} />
        <FilmSection title="Film Horror" films={horrorFilms} icon={GhostIcon} />
        <FilmSection title="Film di Animazione" films={animationFilms} icon={SparklesIcon} />
        <FilmSection title="Film per la Famiglia" films={familyFilms} icon={HomeIcon} />
        <FilmSection title="Film Drammatici" films={dramaFilms} icon={CalendarIcon} />
      </div>

      <footer style={styles.footer}>
        <div style={styles.footerLogo}>
          <div style={styles.footerLogoIcon}>
            <FilmIcon />
          </div>
          <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff' }}>FilmFinder</span>
        </div>
        <p style={styles.footerText}>
          FilmFinder. Trova il tuo prossimo film preferito.
        </p>
      </footer>

      <style>{`
        .film-row::-webkit-scrollbar {
          display: none;
        }
        input:focus {
          box-shadow: 0 0 0 2px #ef4444;
        }
        button:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};

export default FilmFinder;