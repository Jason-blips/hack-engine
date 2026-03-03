import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { THEME, DEMO_VERIFICATION_CODE, RESEND_COOLDOWN_SEC, VERIFICATION_CODE_LENGTH } from '../constants';

function VerificationPage() {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [code, setCode] = useState('');
    const [countdown, setCountdown] = useState(RESEND_COOLDOWN_SEC);
    const [isVerified, setIsVerified] = useState(false);
    const [message, setMessage] = useState({ type: null, text: '' });

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleSubmit = () => {
        setMessage({ type: null, text: '' });
        if (code === DEMO_VERIFICATION_CODE) {
            setIsVerified(true);
            setMessage({ type: 'success', text: 'Verification successful!' });
        } else {
            setMessage({ type: 'error', text: 'Invalid verification code. Please try again.' });
        }
    };

    const handleResend = () => {
        if (countdown === 0) {
            setCountdown(RESEND_COOLDOWN_SEC);
            setMessage({ type: 'success', text: 'A new verification code has been sent.' });
        }
    };

    return (
        <div className="page-card-layout">
        <div className="verification-container">
            <h2>Enter Verification Code</h2>
            {message.text && (
                <p className={message.type === 'error' ? 'error-message' : 'success-message'} role="alert">
                    {message.text}
                </p>
            )}
            <div className="input-group">
                <input 
                    type="text" 
                    placeholder={`${VERIFICATION_CODE_LENGTH}-digit code`}
                    maxLength={VERIFICATION_CODE_LENGTH} 
                    value={code} 
                    onChange={(e) => setCode(e.target.value)} 
                    disabled={isVerified}
                    aria-invalid={message.type === 'error'}
                />
                <button 
                    type="button"
                    onClick={handleSubmit}
                    disabled={isVerified || code.length < VERIFICATION_CODE_LENGTH}
                >
                    {isVerified ? 'Verified' : 'Submit'}
                </button>
            </div>
            <button
                type="button"
                className="countdown-button"
                onClick={handleResend}
                disabled={countdown > 0}
                aria-label={countdown > 0 ? `Resend code in ${countdown} seconds` : 'Resend verification code'}
            >
                {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend code'}
            </button>
            {isVerified && <p className="success-message">Verification complete!</p>}
            <p style={{ marginTop: '1.5rem', fontSize: '14px' }}>
              <button
                type="button"
                onClick={async () => { await logout(); navigate('/login'); }}
                style={{ background: 'none', border: 'none', padding: 0, color: THEME.primary, cursor: 'pointer', fontSize: '14px' }}
              >
                Log out
              </button>
            </p>
        </div>
        </div>
    );
}

export default VerificationPage;