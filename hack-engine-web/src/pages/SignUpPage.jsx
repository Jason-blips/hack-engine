import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FaSpinner, FaLock, FaUser } from 'react-icons/fa';
import GlobalBanner from '../components/GlobalBanner';
import PasswordStrengthBar from '../components/PasswordStrengthBar';
import { THEME } from '../constants';
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
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
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
