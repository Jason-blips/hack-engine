import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function PaymentSuccessPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const orderDetails = state?.orderDetails;

  return (
    <div className="page-card-layout">
    <div className="payment-success-container">
      <div className="success-icon">✓</div>
      <h2 className="success-title">Payment Successful!</h2>

      {orderDetails && (
        <div className="order-summary">
          <p>Amount: ${Number(orderDetails.amount).toFixed(2)}</p>
          <p>Order #: {orderDetails.orderNumber}</p>
          <p>Date: {new Date(orderDetails.date).toLocaleString()}</p>
        </div>
      )}

      <p className="thank-you-message">Thank you for your purchase!</p>

      <button
        type="button"
        className="continue-button"
        onClick={() => navigate('/verification')}
      >
        Continue
      </button>
    </div>
    </div>
  );
}

export default PaymentSuccessPage;