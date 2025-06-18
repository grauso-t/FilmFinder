import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const FilmIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect width="18" height="18" x="3" y="3" rx="2"></rect>
      <path d="M7 3v18"></path><path d="M3 7.5h4"></path><path d="M3 12h18"></path><path d="M3 16.5h4"></path>
      <path d="M17 3v18"></path><path d="M17 7.5h4"></path><path d="M17 16.5h4"></path>
    </svg>
  );

  const UserIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );

  const MailIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect width="20" height="16" x="2" y="4" rx="2"></rect>
      <path d="m22 7-10 5L2 7"></path>
    </svg>
  );

  const LockIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  );

  const EyeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );

  const EyeOffIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
      <line x1="2" y1="2" x2="22" y2="22"></line>
    </svg>
  );

  const ArrowLeftIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m12 19-7-7 7-7"></path>
      <path d="M19 12H5"></path>
    </svg>
  );

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Email e password sono obbligatori');
      return false;
    }

    if (!isLogin) {
      if (!formData.username) {
        setError('Username è obbligatorio');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Le password non coincidono');
        return false;
      }
      if (formData.password.length < 6) {
        setError('La password deve essere di almeno 6 caratteri');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const endpoint = isLogin ? '/api/users/login' : '/api/users/';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : { 
            username: formData.username, 
            email: formData.email, 
            password: formData.password 
          };

      const response = await fetch(`http://127.0.0.1:5000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          localStorage.setItem('user', JSON.stringify(data));
          setSuccess('Login effettuato con successo!');
          setTimeout(() => {
            navigate('/home');
          }, 1000);
        } else {
          setSuccess('Registrazione completata! Ora puoi effettuare il login.');
          setFormData({ username: '', email: '', password: '', confirmPassword: '' });
          setTimeout(() => {
            setIsLogin(true);
            setSuccess('');
            navigate('/home');
          }, 1000);
        }
      } else {
        setError(data.error || 'Si è verificato un errore');
      }
    } catch (err) {
      setError('Errore di connessione. Assicurati che il server sia attivo.');
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    navigate('/home');
  };

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      navigate('/home');
    }
  }, [navigate]);

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#111827',
      color: '#ffffff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      position: 'relative'
    },
    backButton: {
      position: 'absolute',
      top: '2rem',
      left: '2rem',
      background: 'rgba(55, 65, 81, 0.8)',
      border: 'none',
      borderRadius: '50%',
      width: '48px',
      height: '48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: '#ffffff',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(8px)'
    },
    authCard: {
      background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(31, 41, 55, 0.95))',
      borderRadius: '20px',
      padding: '3rem',
      width: '100%',
      maxWidth: '450px',
      backdropFilter: 'blur(20px)',
      border: '1px solid #374151',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
      position: 'relative',
      overflow: 'hidden'
    },
    cardAccent: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: 'linear-gradient(90deg, #ef4444, #dc2626, #991b1b)',
      borderRadius: '20px 20px 0 0'
    },
    logoContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '2rem'
    },
    logoIcon: {
      width: '48px',
      height: '48px',
      background: 'linear-gradient(135deg, #dc2626, #991b1b)',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 8px 16px rgba(220, 38, 38, 0.3)',
      marginRight: '12px'
    },
    logoText: {
      fontSize: '28px',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '0.5rem'
    },
    subtitle: {
      color: '#9ca3af',
      textAlign: 'center',
      marginBottom: '2rem',
      fontSize: '14px'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    },
    inputGroup: {
      position: 'relative'
    },
    inputIcon: {
      position: 'absolute',
      left: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#9ca3af',
      zIndex: 1
    },
    input: {
      width: '100%',
      backgroundColor: 'rgba(55, 65, 81, 0.8)',
      border: '1px solid #4b5563',
      borderRadius: '12px',
      padding: '16px 16px 16px 48px',
      fontSize: '16px',
      color: '#ffffff',
      outline: 'none',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(8px)',
      boxSizing: 'border-box'
    },
    inputFocus: {
      borderColor: '#ef4444',
      boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.1)'
    },
    passwordContainer: {
      position: 'relative'
    },
    eyeButton: {
      position: 'absolute',
      right: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      color: '#9ca3af',
      cursor: 'pointer',
      padding: '4px',
      borderRadius: '4px',
      transition: 'color 0.3s ease'
    },
    submitButton: {
      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
      border: 'none',
      borderRadius: '12px',
      padding: '16px',
      fontSize: '16px',
      fontWeight: '600',
      color: '#ffffff',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 16px rgba(239, 68, 68, 0.3)',
      position: 'relative',
      overflow: 'hidden',
      boxSizing: 'border-box'
    },
    submitButtonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(239, 68, 68, 0.4)'
    },
    submitButtonLoading: {
      opacity: 0.8,
      cursor: 'not-allowed'
    },
    toggleContainer: {
      textAlign: 'center',
      marginTop: '1.5rem'
    },
    toggleText: {
      color: '#9ca3af',
      fontSize: '14px'
    },
    toggleButton: {
      background: 'none',
      border: 'none',
      color: '#ef4444',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '14px',
      marginLeft: '4px',
      textDecoration: 'underline',
      transition: 'color 0.3s ease'
    },
    alert: {
      padding: '12px 16px',
      borderRadius: '8px',
      fontSize: '14px',
      marginBottom: '1rem',
      border: '1px solid',
      boxSizing: 'border-box'
    },
    alertError: {
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      borderColor: '#ef4444',
      color: '#fca5a5'
    },
    alertSuccess: {
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      borderColor: '#22c55e',
      color: '#86efac'
    },
    loadingSpinner: {
      width: '20px',
      height: '20px',
      border: '2px solid transparent',
      borderTop: '2px solid #ffffff',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginRight: '8px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.1,
        background: `
          radial-gradient(circle at 20% 50%, #ef4444 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, #dc2626 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, #991b1b 0%, transparent 50%)
        `
      }} />

      <button 
        style={styles.backButton}
        onClick={goBack}
        onMouseEnter={(e) => {
          e.target.style.background = 'rgba(55, 65, 81, 1)';
          e.target.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(55, 65, 81, 0.8)';
          e.target.style.transform = 'scale(1)';
        }}
      >
        <ArrowLeftIcon />
      </button>

      <div style={styles.authCard}>
        <div style={styles.cardAccent} />
        
        <div style={styles.logoContainer}>
          <div style={styles.logoIcon}>
            <FilmIcon />
          </div>
          <span style={styles.logoText}>FilmFinder</span>
        </div>

        <h1 style={styles.title}>
          {isLogin ? 'Bentornato!' : 'Unisciti a noi'}
        </h1>
        <p style={styles.subtitle}>
          {isLogin 
            ? 'Accedi per continuare la tua esperienza cinematografica' 
            : 'Crea il tuo account per scoprire film incredibili'
          }
        </p>

        {error && (
          <div style={{...styles.alert, ...styles.alertError}}>
            {error}
          </div>
        )}
        {success && (
          <div style={{...styles.alert, ...styles.alertSuccess}}>
            {success}
          </div>
        )}

        <div style={styles.form}>
          {!isLogin && (
            <div style={styles.inputGroup}>
              <div style={styles.inputIcon}>
                <UserIcon />
              </div>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                style={styles.input}
                onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={(e) => {
                  e.target.style.borderColor = '#4b5563';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          )}

          <div style={styles.inputGroup}>
            <div style={styles.inputIcon}>
              <MailIcon />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              style={styles.input}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => {
                e.target.style.borderColor = '#4b5563';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{...styles.inputGroup, ...styles.passwordContainer}}>
            <div style={styles.inputIcon}>
              <LockIcon />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              style={styles.input}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => {
                e.target.style.borderColor = '#4b5563';
                e.target.style.boxShadow = 'none';
              }}
            />
            <button
              type="button"
              style={styles.eyeButton}
              onClick={() => setShowPassword(!showPassword)}
              onMouseEnter={(e) => e.target.style.color = '#ffffff'}
              onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          {!isLogin && (
            <div style={{...styles.inputGroup, ...styles.passwordContainer}}>
              <div style={styles.inputIcon}>
                <LockIcon />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Conferma Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                style={styles.input}
                onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={(e) => {
                  e.target.style.borderColor = '#4b5563';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                style={styles.eyeButton}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
              >
                {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          )}

          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            style={{
              ...styles.submitButton,
              ...(loading ? styles.submitButtonLoading : {})
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                Object.assign(e.target.style, styles.submitButtonHover);
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 16px rgba(239, 68, 68, 0.3)';
              }
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {loading && <div style={styles.loadingSpinner} />}
              {isLogin 
                ? (loading ? 'Accesso in corso...' : 'Accedi') 
                : (loading ? 'Registrazione...' : 'Registrati')
              }
            </div>
          </button>
        </div>

        <div style={styles.toggleContainer}>
          <span style={styles.toggleText}>
            {isLogin ? 'Non hai un account?' : 'Hai già un account?'}
          </span>
          <button
            type="button"
            style={styles.toggleButton}
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setSuccess('');
              setFormData({ username: '', email: '', password: '', confirmPassword: '' });
            }}
            onMouseEnter={(e) => e.target.style.color = '#dc2626'}
            onMouseLeave={(e) => e.target.style.color = '#ef4444'}
          >
            {isLogin ? 'Registrati' : 'Accedi'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0px 1000px rgba(55, 65, 81, 0.8) inset !important;
          -webkit-text-fill-color: #ffffff !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>
    </div>
  );
};

export default AuthPage;