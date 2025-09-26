import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Agenda from './components/Agenda';
import Notes from './components/Notes';
import Login from './components/Login';
import Register from './components/Register';

const AppContent = () => {
  const [currentPage, setCurrentPage] = useState('agenda');
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}>🌸</div>
        <p style={styles.loadingText}>Chargement...</p>
      </div>
    );
  }

  if (!user) {
    return authMode === 'login' ? (
      <Login onSwitchToRegister={() => setAuthMode('register')} />
    ) : (
      <Register onSwitchToLogin={() => setAuthMode('login')} />
    );
  }

  return (
    <div>
      {/* Navigation avec profil utilisateur */}
      <nav style={styles.nav}>
        <div style={styles.navLeft}>
          <button 
            onClick={() => setCurrentPage("agenda")} 
            style={currentPage === "agenda" ? styles.navButtonActive : styles.navButton}
          >
            📅 Agenda
          </button>
          <button 
            onClick={() => setCurrentPage("notes")} 
            style={currentPage === "notes" ? styles.navButtonActive : styles.navButton}
          >
            📔 Notes
          </button>
        </div>
        
        <div style={styles.userSection}>
          <span style={styles.welcomeText}>
            Bonjour, <strong>{user.username}</strong> {user.avatar}
          </span>
          <button onClick={logout} style={styles.logoutButton}>
            🚪 Déconnexion
          </button>
        </div>
      </nav>

      {/* Contenu de la page */}
      {currentPage === "agenda" ? <Agenda /> : <Notes />}
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

const styles = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #fff5f5 0%, #f8f4ff 100%)',
  },
  loadingSpinner: {
    fontSize: '3em',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: '20px',
    fontSize: '18px',
    color: '#8a2be2',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    padding: '15px 30px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  navLeft: {
    display: 'flex',
    gap: '10px',
  },
  navButton: {
    background: 'rgba(255,255,255,0.2)',
    border: '2px solid rgba(255,255,255,0.3)',
    padding: '12px 30px',
    borderRadius: '25px',
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  navButtonActive: {
    background: 'rgba(255,255,255,0.3)',
    border: '2px solid white',
    padding: '12px 30px',
    borderRadius: '25px',
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transform: 'scale(1.05)',
    boxShadow: '0 4px 15px rgba(255,255,255,0.3)',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  welcomeText: {
    color: 'white',
    fontSize: '16px',
  },
  logoutButton: {
    background: 'rgba(255,255,255,0.2)',
    border: '2px solid rgba(255,255,255,0.3)',
    padding: '8px 16px',
    borderRadius: '20px',
    color: 'white',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
};

export default App;