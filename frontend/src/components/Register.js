import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Register = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const { register, error, setError } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    const result = await register(formData.username, formData.email, formData.password);
    if (result.success) {
      // La redirection est gérée par le composant parent
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🌟 Inscription 🌟</h2>
        <p style={styles.subtitle}>Rejoignez notre communauté !</p>
        
        {error && <div style={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nom d'utilisateur</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              style={styles.input}
              placeholder="Votre pseudo"
              required
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              placeholder="votre@email.com"
              required
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Mot de passe</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              placeholder="Au moins 6 caractères"
              required
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirmer le mot de passe</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={styles.input}
              placeholder="Retapez votre mot de passe"
              required
            />
          </div>
          
          <button type="submit" style={styles.registerButton}>
            🎉 Créer mon compte
          </button>
        </form>
        
        <p style={styles.switchText}>
          Déjà un compte ?{' '}
          <button onClick={onSwitchToLogin} style={styles.switchButton}>
            Se connecter
          </button>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh',
    background: 'linear-gradient(135deg, #fff5f5 0%, #f8f4ff 100%)',
  },
  card: {
    background: 'white',
    padding: '40px',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    color: '#8a2be2',
    textAlign: 'center',
    marginBottom: '10px',
    fontSize: '2em',
  },
  subtitle: {
    color: '#6a5acd',
    textAlign: 'center',
    marginBottom: '30px',
    fontStyle: 'italic',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#6a5acd',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    border: '2px solid #e6e6fa',
    borderRadius: '10px',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  registerButton: {
    background: 'linear-gradient(135deg, #d8bfd8 0%, #b0e0e6 100%)',
    border: 'none',
    padding: '15px',
    borderRadius: '10px',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'transform 0.2s',
  },
  error: {
    background: '#ff6b6b',
    color: 'white',
    padding: '12px',
    borderRadius: '10px',
    marginBottom: '20px',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  switchText: {
    textAlign: 'center',
    marginTop: '20px',
    color: '#666',
  },
  switchButton: {
    background: 'none',
    border: 'none',
    color: '#8a2be2',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontSize: 'inherit',
  },
};

export default Register;