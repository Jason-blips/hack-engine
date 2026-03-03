import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEMO_PAYMENT_PASSWORD, PAYMENT_PASSWORD_LENGTH } from '../constants';

function PaymentPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      if (password === DEMO_PAYMENT_PASSWORD) {
        navigate('/payment-success', {
          state: {
            orderDetails: {
              amount: 99.0,
              orderNumber: 'ORD-' + Date.now(),
              date: new Date().toISOString(),
            },
          },
        });
      } else {
        setError('Invalid payment password. Please try again.');
      }
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="page-card-layout">
    <div className="payment-password-container">
      <h2>Enter Payment Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-field">
          <input
            type="password"
            maxLength={PAYMENT_PASSWORD_LENGTH}
            placeholder={`${PAYMENT_PASSWORD_LENGTH}-digit payment password`}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            autoComplete="off"
            inputMode="numeric"
            pattern="[0-9]*"
          />
          {error && <p className="error-message">{error}</p>}
        </div>
        <button 
          type="submit" 
          disabled={isSubmitting || password.length < PAYMENT_PASSWORD_LENGTH}
          className={isSubmitting ? 'submitting' : ''}
        >
          {isSubmitting ? 'Processing...' : 'Confirm Payment'}
        </button>
      </form>
    </div>
    </div>
  );
}

export default PaymentPasswordPage;