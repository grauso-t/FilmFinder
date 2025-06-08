import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const FilmDetail = () => {
  const { filmId } = useParams();
  const [film, setFilm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- ICONS ---
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

  const StarIcon = ({ filled = false, size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "#fbbf24" : "none"} stroke="#fbbf24" strokeWidth="2">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
    </svg>
  );

  const ArrowLeftIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m15 18-6-6 6-6"></path>
    </svg>
  );

  const CalendarIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );

  const ClockIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12,6 12,12 16,14"></polyline>
    </svg>
  );

  const GlobeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
  );

  const TagIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
      <line x1="7" y1="7" x2="7.01" y2="7"></line>
    </svg>
  );

  const ExternalLinkIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
      <polyline points="15,3 21,3 21,9"></polyline>
      <line x1="10" y1="14" x2="21" y2="3"></line>
    </svg>
  );

  const UsersIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  );

  // Fetch film details
  useEffect(() => {
    const fetchFilmDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://127.0.0.1:5000/api/movies/${filmId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setFilm(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching film details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (filmId) {
      fetchFilmDetails();
    }
  }, [filmId]);

  // Helper functions
  const parseGenres = (genresString) => {
    if (!genresString || genresString === "No Data" || genresString === "[]") return [];
    try {
      return JSON.parse(genresString.replace(/'/g, '"'));
    } catch {
      return genresString.split(',').map(g => g.trim());
    }
  };

  const parseCountries = (countriesString) => {
    if (!countriesString || countriesString === "No Data" || countriesString === "[]") return [];
    try {
      return JSON.parse(countriesString.replace(/'/g, '"'));
    } catch {
      return countriesString.split(',').map(c => c.trim());
    }
  };

  const formatRuntime = (minutes) => {
    if (!minutes || minutes === "No Data" || minutes === 0) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatScore = (score) => {
    if (!score || score === "No Data" || score === 0) return "N/A";
    return typeof score === 'number' ? score.toFixed(1) : score;
  };

  const formatVotes = (votes) => {
    if (!votes || votes === "No Data" || votes === 0) return "N/A";
    return votes.toLocaleString();
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
    backButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      background: 'linear-gradient(135deg, #374151, #4b5563)',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      padding: '8px 16px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: '14px'
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
    main: {
      marginTop: '80px',
      maxWidth: '1200px',
      margin: '80px auto 0',
      padding: '2rem 1rem'
    },
    filmHero: {
      display: 'grid',
      gridTemplateColumns: '300px 1fr',
      gap: '2rem',
      marginBottom: '3rem',
      '@media (max-width: 768px)': {
        gridTemplateColumns: '1fr',
        textAlign: 'center'
      }
    },
    posterContainer: {
      position: 'relative'
    },
    poster: {
      width: '100%',
      height: '450px',
      borderRadius: '12px',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)',
      overflow: 'hidden',
      backgroundColor: '#374151'
    },
    posterImg: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    posterPlaceholder: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#9ca3af',
      fontSize: '18px'
    },
    filmInfo: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    },
    filmTitle: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      lineHeight: '1.2'
    },
    filmTagline: {
      fontSize: '1.2rem',
      color: '#9ca3af',
      marginBottom: '1.5rem',
      fontStyle: 'italic'
    },
    ratingSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '2rem',
      marginBottom: '1.5rem',
      flexWrap: 'wrap'
    },
    ratingBox: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1))',
      padding: '8px 16px',
      borderRadius: '8px',
      border: '1px solid #374151'
    },
    ratingScore: {
      fontSize: '18px',
      fontWeight: 'bold'
    },
    ratingLabel: {
      fontSize: '12px',
      color: '#9ca3af',
      textTransform: 'uppercase'
    },
    quickInfo: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem'
    },
    infoItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#d1d5db'
    },
    genresContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      marginBottom: '2rem'
    },
    genreBadge: {
      background: 'linear-gradient(135deg, #374151, #4b5563)',
      color: '#ffffff',
      padding: '4px 12px',
      borderRadius: '16px',
      fontSize: '14px',
      border: '1px solid #6b7280'
    },
    description: {
      fontSize: '16px',
      lineHeight: '1.6',
      color: '#d1d5db',
      marginBottom: '2rem'
    },
    detailsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem'
    },
    detailCard: {
      background: 'linear-gradient(135deg, rgba(55, 65, 81, 0.5), rgba(75, 85, 99, 0.5))',
      borderRadius: '12px',
      padding: '1.5rem',
      border: '1px solid #374151'
    },
    detailTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    detailContent: {
      color: '#d1d5db'
    },
    externalLinks: {
      display: 'flex',
      gap: '1rem',
      marginTop: '2rem'
    },
    linkButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      background: 'linear-gradient(135deg, #dc2626, #991b1b)',
      color: '#ffffff',
      textDecoration: 'none',
      padding: '12px 20px',
      borderRadius: '8px',
      transition: 'all 0.3s ease',
      fontSize: '14px',
      fontWeight: '500'
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '50vh',
      fontSize: '18px',
      color: '#9ca3af'
    },
    errorContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '50vh',
      fontSize: '18px',
      color: '#ef4444',
      textAlign: 'center'
    }
  };

  if (loading) {
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
            <button style={styles.userButton}>
              <UserIcon />
            </button>
          </div>
        </header>
        <div style={styles.loadingContainer}>
          Caricamento dettagli film...
        </div>
      </div>
    );
  }

  if (error) {
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
            <button style={styles.userButton}>
              <UserIcon />
            </button>
          </div>
        </header>
        <div style={styles.errorContainer}>
          <h2>Errore nel caricamento del film</h2>
          <p>{error}</p>
          <p>Film ID: {filmId}</p>
        </div>
      </div>
    );
  }

  if (!film) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          Film non trovato
        </div>
      </div>
    );
  }

  const genres = parseGenres(film.genres);
  const countries = parseCountries(film.production_countries);

  return (
    <div style={styles.container}>
      {/* Header */}
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
          <button style={styles.userButton}>
            <UserIcon />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Film Hero Section */}
        <div style={styles.filmHero}>
          <div style={styles.posterContainer}>
            <div style={styles.poster}>
              {film.cover_url && film.cover_url !== "No Data" && film.cover_url !== "" ? (
                <img 
                  src={film.cover_url}
                  alt={film.title}
                  style={styles.posterImg}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div style={{...styles.posterPlaceholder, display: (!film.cover_url || film.cover_url === "No Data" || film.cover_url === "") ? 'flex' : 'none'}}>
                <FilmIcon />
              </div>
            </div>
          </div>

          <div style={styles.filmInfo}>
            <h1 style={styles.filmTitle}>{film.title || "Titolo non disponibile"}</h1>
            
            {/* Rating Section */}
            <div style={styles.ratingSection}>
              {film.imdb_score && film.imdb_score !== "No Data" && (
                <div style={styles.ratingBox}>
                  <StarIcon filled size={20} />
                  <div>
                    <div style={styles.ratingScore}>{formatScore(film.imdb_score)}</div>
                    <div style={styles.ratingLabel}>IMDb</div>
                  </div>
                </div>
              )}
              {film.tmdb_score && film.tmdb_score !== "No Data" && (
                <div style={styles.ratingBox}>
                  <StarIcon filled size={20} />
                  <div>
                    <div style={styles.ratingScore}>{formatScore(film.tmdb_score)}</div>
                    <div style={styles.ratingLabel}>TMDb</div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Info */}
            <div style={styles.quickInfo}>
              {film.release_year && film.release_year !== "No Data" && (
                <div style={styles.infoItem}>
                  <CalendarIcon />
                  <span>{film.release_year}</span>
                </div>
              )}
              {film.runtime && film.runtime !== "No Data" && (
                <div style={styles.infoItem}>
                  <ClockIcon />
                  <span>{formatRuntime(film.runtime)}</span>
                </div>
              )}
              {film.age_certification && film.age_certification !== "No Data" && film.age_certification !== "" && (
                <div style={styles.infoItem}>
                  <TagIcon />
                  <span>{film.age_certification}</span>
                </div>
              )}
            </div>

            {/* Genres */}
            {genres.length > 0 && (
              <div style={styles.genresContainer}>
                {genres.map((genre, index) => (
                  <span key={index} style={styles.genreBadge}>
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            {film.description && film.description !== "No Data" && film.description !== "" && (
              <p style={styles.description}>
                {film.description}
              </p>
            )}
          </div>
        </div>

        {/* Details Grid */}
        <div style={styles.detailsGrid}>
          {/* Production Info */}
          <div style={styles.detailCard}>
            <h3 style={styles.detailTitle}>
              <GlobeIcon />
              Informazioni di Produzione
            </h3>
            <div style={styles.detailContent}>
              {countries.length > 0 && (
                <p><strong>Paesi:</strong> {countries.join(', ')}</p>
              )}
              <p><strong>Tipo:</strong> {film.type || "N/A"}</p>
              {film.seasons && film.seasons !== "No Data" && film.seasons !== "" && (
                <p><strong>Stagioni:</strong> {film.seasons}</p>
              )}
            </div>
          </div>

          {/* Ratings & Stats */}
          <div style={styles.detailCard}>
            <h3 style={styles.detailTitle}>
              <UsersIcon />
              Valutazioni e Statistiche
            </h3>
            <div style={styles.detailContent}>
              {film.imdb_votes && film.imdb_votes !== "No Data" && (
                <p><strong>Voti IMDb:</strong> {formatVotes(film.imdb_votes)}</p>
              )}
              {film.tmdb_popularity && film.tmdb_popularity !== "No Data" && (
                <p><strong>Popolarità TMDb:</strong> {film.tmdb_popularity.toFixed(1)}</p>
              )}
              {film.imdb_id && film.imdb_id !== "No Data" && film.imdb_id !== "" && (
                <p><strong>ID IMDb:</strong> {film.imdb_id}</p>
              )}
            </div>
          </div>
        </div>

        {/* External Links */}
        {film.imdb_id && film.imdb_id !== "No Data" && film.imdb_id !== "" && (
          <div style={styles.externalLinks}>
            <a 
              href={`https://www.imdb.com/title/${film.imdb_id}`}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.linkButton}
            >
              <ExternalLinkIcon />
              Visualizza su IMDb
            </a>
          </div>
        )}
      </main>

      <style>{`
        button:hover {
          transform: scale(1.05);
          filter: brightness(1.1);
        }
        
        a:hover {
          transform: scale(1.05);
          filter: brightness(1.1);
        }
        
        @media (max-width: 768px) {
          .film-hero {
            grid-template-columns: 1fr !important;
            text-align: center;
          }
          
          .details-grid {
            grid-template-columns: 1fr !important;
          }
          
          .rating-section {
            justify-content: center;
          }
          
          .quick-info {
            justify-content: center;
          }
          
          .genres-container {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default FilmDetail;