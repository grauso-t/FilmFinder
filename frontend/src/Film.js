import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const FilmDetails = () => {
  const navigate = useNavigate();
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  const { filmId } = useParams();
  const [film, setFilm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleBackToHome = () => {
    navigate('/home');
  };

  const addToFavorites = async () => {
    if (!user || !user.id) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:5000/api/users/${user.id}/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ movie_id: filmId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Errore nell'aggiunta ai preferiti");
      }
      
      setIsFavorite(true);
      console.log("Film aggiunto ai preferiti");
    } catch (error) {
      console.error("Errore durante l'aggiunta ai preferiti:", error);
    }
  };
  
  const removeFromFavorites = async () => {
    if (!user || !user.id) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:5000/api/users/${user.id}/favorites/${filmId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Errore nella rimozione dai preferiti");
      }
      
      setIsFavorite(false);
      console.log("Film rimosso dai preferiti");
    } catch (error) {
      console.error("Errore durante la rimozione dai preferiti:", error);
    }
  };

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      removeFromFavorites();
    } else {
      addToFavorites();
    }
  };

  const ArrowLeftIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m12 19-7-7 7-7"/>
      <path d="m19 12H5"/>
    </svg>
  );

  const StarIcon = ({ filled = false, size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "#fbbf24" : "none"} stroke="#fbbf24" strokeWidth="2">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
    </svg>
  );
  
  const HeartIcon = ({ filled = false, size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
  );

  const CalendarIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );

  const ClockIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12,6 12,12 16,14"></polyline>
    </svg>
  );
  
  const FilmIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect width="18" height="18" x="3" y="3" rx="2"></rect>
      <path d="M7 3v18"></path>
      <path d="M3 7.5h4"></path>
      <path d="M3 12h18"></path>
      <path d="M3 16.5h4"></path>
      <path d="M17 3v18"></path>
      <path d="M17 7.5h4"></path>
      <path d="M17 16.5h4"></path>
    </svg>
  );

  const TvIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
      <line x1="8" y1="21" x2="16" y2="21"></line>
      <line x1="12" y1="17" x2="12" y2="21"></line>
    </svg>
  );

  useEffect(() => {
    const fetchFilmAndFavoriteStatus = async () => {
      if (!filmId) return;
      
      setLoading(true);
      try {
        const filmResponse = await fetch(`http://127.0.0.1:5000/api/movies/${filmId}`);
        if (!filmResponse.ok) {
          throw new Error(`HTTP error! status: ${filmResponse.status}`);
        }
        const filmData = await filmResponse.json();
        setFilm(filmData);

        if (user && user.id) {
          const favoriteResponse = await fetch(`http://127.0.0.1:5000/api/users/${user.id}/favorites/${filmId}`);
          if (favoriteResponse.ok) {
            const favoriteData = await favoriteResponse.json();
            setIsFavorite(favoriteData.is_favorite);
          } else if (favoriteResponse.status !== 404) {
            throw new Error('Errore nel controllo dei preferiti');
          }
        }
      } catch (err) {
        setError(err.message);
        console.error('Errore durante il fetch dei dati:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilmAndFavoriteStatus();
  }, [filmId, user?.id]);


  const parseGenres = (genresString) => {
    try {
      return JSON.parse(genresString.replace(/'/g, '"'));
    } catch {
      return [];
    }
  };

  const parseCountries = (countriesString) => {
    try {
      return JSON.parse(countriesString.replace(/'/g, '"'));
    } catch {
      return [];
    }
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating / 2);
    const hasHalfStar = (rating / 2) % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<StarIcon key={i} filled size={20} />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<StarIcon key={i} size={20} />);
      } else {
        stars.push(<StarIcon key={i} size={20} />);
      }
    }
    return stars;
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
      alignItems: 'center'
    },
    backButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: 'transparent',
      border: 'none',
      color: '#ffffff',
      fontSize: '16px',
      cursor: 'pointer',
      padding: '8px 16px',
      borderRadius: '8px',
      transition: 'all 0.3s ease'
    },
    heroSection: {
      marginTop: '80px',
      position: 'relative',
      height: '70vh',
      display: 'flex',
      alignItems: 'flex-end',
      overflow: 'hidden'
    },
    heroBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      filter: 'blur(8px) brightness(0.3)',
      transform: 'scale(1.1)'
    },
    heroOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(transparent 0%, rgba(17, 24, 39, 0.8) 70%, #111827 100%)'
    },
    heroContent: {
      position: 'relative',
      zIndex: 10,
      maxWidth: '1200px',
      margin: '0 auto',
      width: '100%',
      padding: '0 1rem 3rem',
      display: 'flex',
      gap: '2rem',
      alignItems: 'flex-end'
    },
    posterContainer: {
      flexShrink: 0,
      position: 'relative'
    },
    poster: {
      width: '300px',
      height: '450px',
      borderRadius: '12px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
      objectFit: 'cover',
      border: '2px solid #374151'
    },
    posterPlaceholder: {
      width: '300px',
      height: '450px',
      backgroundColor: '#374151',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#9ca3af',
      fontSize: '18px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
      border: '2px solid #374151'
    },
    filmInfo: {
      flex: 1,
      paddingBottom: '1rem'
    },
    filmTitle: {
      fontSize: '3rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      lineHeight: '1.1',
      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
    },
    filmMeta: {
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem',
      marginBottom: '1.5rem',
      flexWrap: 'wrap'
    },
    metaItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      color: '#d1d5db',
      fontSize: '16px'
    },
    ratingContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '1.5rem'
    },
    ratingStars: {
      display: 'flex',
      gap: '2px'
    },
    ratingText: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#fbbf24'
    },
    genres: {
      display: 'flex',
      gap: '8px',
      marginBottom: '1.5rem',
      flexWrap: 'wrap'
    },
    genreTag: {
      backgroundColor: 'rgba(239, 68, 68, 0.2)',
      color: '#ef4444',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '14px',
      fontWeight: '500',
      border: '1px solid rgba(239, 68, 68, 0.3)'
    },
    description: {
      fontSize: '18px',
      lineHeight: '1.6',
      color: '#d1d5db',
      maxWidth: '800px',
      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
    },
    actionButtons: {
      display: 'flex',
      gap: '1rem',
      marginTop: '2rem'
    },
    favoriteButton: {
      backgroundColor: '#ef4444',
      color: '#ffffff',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
    },
     favoriteButtonRemove: {
      backgroundColor: '#374151',
      color: '#ffffff',
      border: '1px solid #4b5563',
      padding: '12px 24px',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
    },
    detailsSection: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '3rem 1rem'
    },
    detailsGrid: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '3rem',
      marginBottom: '3rem'
    },
    castSection: {
      backgroundColor: '#1f2937',
      borderRadius: '12px',
      padding: '2rem',
      border: '1px solid #374151'
    },
    sectionTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '1.5rem',
      color: '#ffffff'
    },
    castGrid: {
      display: 'grid',
      gap: '1rem'
    },
    castMember: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 0',
      borderBottom: '1px solid #374151'
    },
    actorName: {
      fontWeight: '600',
      color: '#ffffff'
    },
    characterName: {
      color: '#9ca3af',
      fontSize: '14px'
    },
    infoSection: {
      backgroundColor: '#1f2937',
      borderRadius: '12px',
      padding: '2rem',
      border: '1px solid #374151'
    },
    infoItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 0',
      borderBottom: '1px solid #374151'
    },
    infoLabel: {
      color: '#9ca3af',
      fontSize: '14px'
    },
    infoValue: {
      color: '#ffffff',
      fontWeight: '500',
      textAlign: 'right'
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '18px',
      color: '#9ca3af'
    },
    errorContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '18px',
      color: '#ef4444',
      textAlign: 'center',
      gap: '1rem'
    }
  };


  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          Caricamento dettagli...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <h2>Errore nel caricamento</h2>
          <p>{error}</p>
          <button 
            style={styles.favoriteButton}
            onClick={handleBackToHome}
          >
            <ArrowLeftIcon />
            Torna indietro
          </button>
        </div>
      </div>
    );
  }

  if (!film) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <h2>Film non trovato</h2>
          <button 
            style={styles.favoriteButton}
            onClick={handleBackToHome}
          >
            <ArrowLeftIcon />
            Torna indietro
          </button>
        </div>
      </div>
    );
  }

  const genres = parseGenres(film.genres || '[]');
  const countries = parseCountries(film.production_countries || '[]');

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <button 
            style={styles.backButton}
            onClick={handleBackToHome}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#374151'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <ArrowLeftIcon />
            Torna indietro
          </button>
        </div>
      </header>

      <div style={styles.heroSection}>
        {film.cover_url && !imageError && (
          <div 
            style={{
              ...styles.heroBackground,
              backgroundImage: `url(${film.cover_url})`
            }}
          />
        )}
        <div style={styles.heroOverlay} />
        
        <div style={styles.heroContent}>
          <div style={styles.posterContainer}>
            {film.cover_url && !imageError ? (
              <img
                src={film.cover_url}
                alt={film.title}
                style={styles.poster}
                onError={() => setImageError(true)}
              />
            ) : (
              <div style={styles.posterPlaceholder}>
                <FilmIcon />
              </div>
            )}
          </div>

          <div style={styles.filmInfo}>
            <h1 style={styles.filmTitle}>{film.title}</h1>
            
            <div style={styles.filmMeta}>
              <div style={styles.metaItem}>
                <CalendarIcon />
                <span>{film.release_year}</span>
              </div>
              
              {film.runtime && (
                <div style={styles.metaItem}>
                  <ClockIcon />
                  <span>{formatRuntime(film.runtime)}</span>
                </div>
              )}
              
              {film.type === 'SHOW' && film.seasons && (
                <div style={styles.metaItem}>
                  <TvIcon />
                  <span>{film.seasons} stagioni</span>
                </div>
              )}
              
              {film.age_certification && (
                <div style={styles.metaItem}>
                  <span style={{
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {film.age_certification}
                  </span>
                </div>
              )}
            </div>

            {film.imdb_score && (
              <div style={styles.ratingContainer}>
                <div style={styles.ratingStars}>
                  {renderStars(film.imdb_score)}
                </div>
                <span style={styles.ratingText}>
                  {film.imdb_score}/10
                </span>
                {film.imdb_votes && (
                  <span style={{ color: '#9ca3af', fontSize: '14px' }}>
                    ({film.imdb_votes.toLocaleString()} voti)
                  </span>
                )}
              </div>
            )}

            {genres.length > 0 && (
              <div style={styles.genres}>
                {genres.map((genre, index) => (
                  <span key={index} style={styles.genreTag}>
                    {genre.charAt(0).toUpperCase() + genre.slice(1)}
                  </span>
                ))}
              </div>
            )}

            <p style={styles.description}>{film.description}</p>

            <div style={styles.actionButtons}>
              {user && (
                <button 
                  style={isFavorite ? styles.favoriteButtonRemove : styles.favoriteButton}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  onClick={handleFavoriteToggle}
                >
                  <HeartIcon filled={isFavorite} />
                  {isFavorite ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={styles.detailsSection}>
        <div style={styles.detailsGrid}>
          {film.actors && film.actors.length > 0 && (
            <div style={styles.castSection}>
              <h2 style={styles.sectionTitle}>Cast Principale</h2>
              <div style={styles.castGrid}>
                {film.actors.slice(0, 8).map((actor, index) => (
                  <div key={index} style={styles.castMember}>
                    <div>
                      <div style={styles.actorName}>{actor.name}</div>
                      <div style={styles.characterName}>{actor.character}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={styles.infoSection}>
            <h2 style={styles.sectionTitle}>Informazioni</h2>
            
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Tipo</span>
              <span style={styles.infoValue}>
                {film.type === 'SHOW' ? 'Serie TV' : 'Film'}
              </span>
            </div>

            {film.imdb_id && (
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>IMDb ID</span>
                <span style={styles.infoValue}>{film.imdb_id}</span>
              </div>
            )}

            {film.tmdb_score && (
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>TMDb Score</span>
                <span style={styles.infoValue}>{film.tmdb_score}/10</span>
              </div>
            )}

            {film.tmdb_popularity && (
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Popolarità TMDb</span>
                <span style={styles.infoValue}>{Math.round(film.tmdb_popularity)}</span>
              </div>
            )}

            {countries.length > 0 && (
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Paesi di Produzione</span>
                <span style={styles.infoValue}>
                  {countries.join(', ')}
                </span>
              </div>
            )}

            {film.directors && film.directors.length > 0 && (
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Regia</span>
                <span style={styles.infoValue}>
                  {film.directors.map(d => d.name).join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-content {
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
          }
          
          .details-grid {
            grid-template-columns: 1fr !important;
          }
          
          .film-title {
            font-size: 2rem !important;
          }
          
          .poster {
            width: 250px !important;
            height: 375px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default FilmDetails;