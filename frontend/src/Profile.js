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
      backgroundColor: '#1f2937',
      borderRadius: '8px',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      position: 'relative',
      border: '1px solid #374151',
    },
    poster: {
      width: '100%',
      height: '350px',
      objectFit: 'cover',
      display: imageError ? 'none' : 'block',
    },
    placeholder: {
      width: '100%',
      height: '350px',
      backgroundColor: '#374151',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#9ca3af',
    },
    info: {
      padding: '1rem',
    },
    title: {
      color: '#ffffff',
      fontWeight: 'bold',
      fontSize: '1rem',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  };

  return (
    <div 
      style={styles.card} 
      onClick={handleCardClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.5)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
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
      backgroundColor: '#111827',
      color: '#ffffff',
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
      borderBottom: '1px solid #374151',
      paddingBottom: '1rem',
    },
    title: {
      fontSize: '2rem',
      fontWeight: 'bold',
    },
     backButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: '#374151',
      border: 'none',
      color: '#ffffff',
      fontSize: '16px',
      cursor: 'pointer',
      padding: '10px 16px',
      borderRadius: '8px',
      transition: 'background-color 0.3s ease',
    },
    content: {
      textAlign: 'center',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
      gap: '1.5rem',
      marginTop: '2rem',
    },
    message: {
      color: '#9ca3af',
      fontSize: '1.2rem',
      marginTop: '4rem',
    },
  };

  if (loading) {
    return <div style={styles.container}><h2 style={styles.message}>Caricamento profilo...</h2></div>;
  }

  if (error) {
    return <div style={styles.container}><h2 style={styles.message}>Errore: {error}</h2></div>;
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        {user && <h1 style={styles.title}>Preferiti di {user.username}</h1>}
         <button 
            style={styles.backButton}
            onClick={() => navigate('/home')}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#4b5563'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#374151'}
          >
           Torna alla Home
          </button>
      </header>

      <div style={styles.content}>
        {favoriteMovies.length > 0 ? (
          <div style={styles.grid}>
            {favoriteMovies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <p style={styles.message}>Non hai ancora aggiunto nessun film ai preferiti.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;