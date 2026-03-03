import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.code}>404</h1>
      <p style={styles.message}>Oops! Page not found.</p>
      <Link to="/login" style={styles.link}>Go back to Home</Link>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    paddingTop: '10vh',
    fontFamily: 'Arial, sans-serif',
  },
  code: {
    fontSize: '96px',
    fontWeight: 'bold',
    color: '#333',
  },
  message: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  link: {
    fontSize: '18px',
    textDecoration: 'none',
    color: '#4a90e2',
  },
};

export default NotFoundPage;
