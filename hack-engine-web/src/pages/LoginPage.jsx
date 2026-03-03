import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FaUser, FaLock, FaSpinner } from 'react-icons/fa';
import GlobalBanner from '../components/GlobalBanner';
import { THEME, BACKEND_URL } from '../constants';
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

const LoginCard = styled.div`
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

const Subtitle = styled.p`
  color: #666;
  text-align: center;
  margin-bottom: 30px;
  font-size: 16px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
  position: relative;
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
    box-shadow: 0 0 0 3px ${THEME.focusRing};
    outline: none;
  }
`;

const Icon = styled.span`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
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

  &:hover {
    background: ${THEME.gradientButtonHover};
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
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

const ButtonSpinner = styled(FaSpinner)`
  animation: spin 1s linear infinite;
  margin-right: 10px;

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const ForgotPassword = styled.span`
  display: block;
  text-align: right;
  color: ${THEME.primary};
  font-size: 14px;
  margin-top: 10px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
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

  span {
    padding: 0 10px;
    color: #999;
    font-size: 14px;
  }
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

  &:hover {
    background: #f9f9f9;
  }
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
  & svg {
    width: 100%;
    height: 100%;
  }
`;

const SignUpText = styled.p`
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

function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const validateForm = () => {
    if (!username.trim()) return 'Please enter your username';
    if (!password.trim()) return 'Please enter your password';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const user = await authApi.login(username.trim(), password);
      onLoginSuccess(user);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <GlobalBanner>
        Hack Engine — Enter the system
      </GlobalBanner>

      <Container>
        <LoginCard>
          <Title>Hack Engine</Title>

          <form onSubmit={handleSubmit} aria-label="Login form">
            <FormGroup>
              <Icon aria-hidden><FaUser /></Icon>
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                aria-label="Username"
                autoComplete="username"
              />
            </FormGroup>

            <FormGroup>
              <Icon aria-hidden><FaLock /></Icon>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                aria-label="Password"
                autoComplete="current-password"
              />
            </FormGroup>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <Button type="submit" disabled={isLoading}>
              {isLoading ? (<><ButtonSpinner /> Logging in...</>) : 'Login'}
            </Button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                Remember me
              </label>
              <ForgotPassword>Forgot password?</ForgotPassword>
            </div>
          </form>

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

          <SignUpText>
            Don’t have an account? <Link to="/signup">Sign up</Link>
          </SignUpText>
        </LoginCard>
      </Container>
    </>  
  );
}

export default LoginPage;