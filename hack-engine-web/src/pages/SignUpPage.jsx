import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FaSpinner, FaLock, FaUser } from 'react-icons/fa';
import GlobalBanner from '../components/GlobalBanner';
import PasswordStrengthBar from '../components/PasswordStrengthBar';
import { THEME, BACKEND_URL } from '../constants';
import { isWeakPassword } from '../utils/passwordStrength';
import * as authApi from '../api/authApi';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: ${THEME.gradient};
  padding: 20px;
`;

const RegisterCard = styled.div`
  background: white;
  border-radius: 15px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  padding: 40px;
  animation: ${fadeIn} 0.6s ease-out;
`;

const Title = styled.h2`
  color: #333;
  text-align: center;
  margin-bottom: 25px;
  font-size: 24px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  position: relative;
`;

const InputIcon = styled.span`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px 15px 15px 45px;
  border: 2px solid #eee;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;
  transition: all 0.3s;

  &:focus {
    border-color: ${THEME.primary};
    outline: none;
    box-shadow: 0 0 0 3px ${THEME.focusRing};
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 15px;
  background: ${THEME.gradientButton};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;

  &:hover {
    background: ${THEME.gradientButtonHover};
    transform: translateY(-2px);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.p`
  color: ${THEME.error};
  font-size: 14px;
  margin: 5px 0;
`;

const SuccessMessage = styled.p`
  color: ${THEME.success};
  font-size: 14px;
  margin: 5px 0;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0;
  &::before, &::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid #eee;
  }
  span { padding: 0 10px; color: #999; font-size: 14px; }
`;

const SocialButton = styled.button`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 10px;
  &:hover { background: #f9f9f9; }
`;

const GoogleIcon = styled.span`
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 10px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Cpath fill='%23EA4335' d='M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z'/%3E%3Cpath fill='%234285F4' d='M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z'/%3E%3Cpath fill='%23FBBC05' d='M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z'/%3E%3Cpath fill='%2342B350' d='M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z'/%3E%3Cpath fill='none' d='M0 0h48v48H0z'/%3E%3C/svg%3E");
  background-size: contain;
`;

const FacebookIcon = styled.span`
  display: inline-flex;
  width: 20px;
  height: 20px;
  margin-right: 10px;
  & svg { width: 100%; height: 100%; }
`;

const SignInText = styled.p`
  text-align: center;
  margin-top: 20px;
  color: #666;

  a {
    color: ${THEME.primary};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

function SignUpPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (isWeakPassword(password)) {
      setError('This password is too common. Please choose a stronger one.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      await authApi.register(username.trim(), password);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const data = err.response?.data;
      const msg =
        data?.error ||
        data?.message ||
        (err.response?.status >= 500
          ? 'Server error. Check that MySQL is running and application.properties is correct.'
          : err.response
            ? 'Registration failed. Please try again.'
            : 'Network error. Is the backend running at http://localhost:8080?');
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <GlobalBanner>Hack Engine — Create account</GlobalBanner>
      <Container>
        <RegisterCard>
          <Title>Create Your Account</Title>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}
          <form onSubmit={handleSubmit} aria-label="Sign up form">
            <FormGroup>
              <InputIcon aria-hidden><FaUser /></InputIcon>
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                disabled={!!success}
              />
            </FormGroup>
            <FormGroup>
              <InputIcon aria-hidden><FaLock /></InputIcon>
              <Input
                type="password"
                placeholder="Password (at least 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                disabled={!!success}
              />
              <PasswordStrengthBar password={password} />
            </FormGroup>
            <FormGroup>
              <InputIcon aria-hidden><FaLock /></InputIcon>
              <Input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                disabled={!!success}
              />
            </FormGroup>
            <Button type="submit" disabled={isLoading || !!success}>
              {isLoading ? <><FaSpinner style={{ animation: 'spin 1s linear infinite', marginRight: 8 }} /> Registering...</> : 'Sign Up'}
            </Button>

            <Divider><span>OR</span></Divider>
            <SocialButton type="button" onClick={() => { window.location.href = `${BACKEND_URL}/oauth2/authorization/google`; }}>
              <GoogleIcon />
              Continue with Google
            </SocialButton>
            <SocialButton type="button" onClick={() => { window.location.href = `${BACKEND_URL}/oauth2/authorization/facebook`; }}>
              <FacebookIcon>
                <svg viewBox="0 0 24 24" fill="#1877F2" aria-hidden><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </FacebookIcon>
              Continue with Facebook
            </SocialButton>
          </form>
          <SignInText>
            Already have an account? <Link to="/login">Sign in</Link>
          </SignInText>
        </RegisterCard>
      </Container>
    </>
  );
}

export default SignUpPage;
