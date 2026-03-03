import React from 'react';

const spinnerStyle = {
  width: '50px',
  height: '50px',
  border: '6px solid #ccc',
  borderTop: '6px solid #333',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
  margin: '100px auto'
};

const LoadingSpinner = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={spinnerStyle} />
      <p>Loading...</p>
    </div>
  );
};

export default LoadingSpinner;
