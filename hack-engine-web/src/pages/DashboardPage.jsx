import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { THEME, APP_NAME } from '../constants';
import * as securityApi from '../api/securityApi';

const blink = keyframes`
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
`;

const Screen = styled.div`
  min-height: 100vh;
  background: #0a0e14;
  color: ${THEME.primary};
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
  padding: 2rem;
  font-size: 14px;
  line-height: 1.6;
`;

const TerminalHeader = styled.div`
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(0, 210, 106, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Prompt = styled.span`
  color: ${THEME.secondary};
  &::after {
    content: '_';
    animation: ${blink} 1s step-end infinite;
    color: ${THEME.primary};
  }
`;

const Line = styled.div`
  margin: 0.25rem 0;
  & strong { color: #7ee787; }
  & .muted { color: #6e7681; }
`;

const Section = styled.section`
  margin: 1.5rem 0;
  max-width: 720px;
`;

const SectionTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: ${THEME.secondary};
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  & th, & td {
    text-align: left;
    padding: 0.5rem 0.75rem;
    border-bottom: 1px solid rgba(0, 210, 106, 0.15);
  }
  & th {
    color: ${THEME.secondary};
    font-weight: 600;
  }
  & td { color: rgba(255,255,255,0.85); }
  & .action-login { color: #7ee787; }
  & .action-logout { color: #ff7b72; }
`;

const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0.5rem 0;
  & span { color: rgba(255,255,255,0.85); }
`;

const Toggle = styled.button`
  width: 44px;
  height: 24px;
  border-radius: 12px;
  border: none;
  background: ${({ $on }) => ($on ? THEME.primary : '#30363d')};
  cursor: pointer;
  position: relative;
  transition: background 0.2s;
  &::after {
    content: '';
    position: absolute;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #fff;
    top: 3px;
    left: ${({ $on }) => ($on ? '23px' : '3px')};
    transition: left 0.2s;
  }
`;

const NavLinks = styled.div`
  margin-top: 1.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  & a, & button {
    color: ${THEME.primary};
    background: none;
    border: 1px solid rgba(0, 210, 106, 0.5);
    padding: 0.5rem 1rem;
    border-radius: 6px;
    text-decoration: none;
    font-family: inherit;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
  }
  & a:hover, & button:hover {
    background: rgba(0, 210, 106, 0.1);
  }
`;

const LogoutBtn = styled.button`
  color: #ff7b72 !important;
  border-color: rgba(255, 123, 114, 0.5) !important;
  &:hover { background: rgba(255, 123, 114, 0.1) !important; }
`;

function formatDate(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function DashboardPage() {
  const { username, logout } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [s, l] = await Promise.all([
          securityApi.getSecuritySummary(),
          securityApi.getSecurityLogs(),
        ]);
        if (!cancelled) {
          setSummary(s);
          setLogs(l || []);
          if (s && typeof s.twoFactorEnabled === 'boolean') setTwoFactorEnabled(s.twoFactorEnabled);
        }
      } catch {
        if (!cancelled) setSummary({});
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Screen>
      <TerminalHeader>
        <div>
          <Line><strong>{APP_NAME}</strong> — Security Dashboard</Line>
          <Line className="muted">user: {username}</Line>
        </div>
        <Prompt>$</Prompt>
      </TerminalHeader>

      {loading ? (
        <Line className="muted">Loading security summary...</Line>
      ) : (
        <>
          <Section>
            <SectionTitle>Account security</SectionTitle>
            <Line>
              <strong>Last login:</strong>{' '}
              <span className="muted">
                {summary?.lastLoginAt ? formatDate(summary.lastLoginAt) : 'First login or no previous record'}
                {summary?.lastLoginIp ? ` from ${summary.lastLoginIp}` : ''}
              </span>
            </Line>
            <ToggleRow>
              <Toggle
                type="button"
                $on={twoFactorEnabled}
                onClick={() => setTwoFactorEnabled((v) => !v)}
                aria-label={twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
              />
              <span>Two-factor authentication (2FA) — {twoFactorEnabled ? 'On' : 'Off'} (demo)</span>
            </ToggleRow>
          </Section>

          <Section>
            <SectionTitle>Recent activity</SectionTitle>
            {logs.length === 0 ? (
              <Line className="muted">No recent login or logout events.</Line>
            ) : (
              <Table>
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>IP</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((entry, i) => (
                    <tr key={i}>
                      <td className={entry.action === 'LOGIN' ? 'action-login' : 'action-logout'}>
                        {entry.action}
                      </td>
                      <td>{entry.ipAddress || '—'}</td>
                      <td>{formatDate(entry.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Section>

          <NavLinks>
            <Link to="/verification">Verification</Link>
            <Link to="/payment-password">Payment</Link>
            <LogoutBtn type="button" onClick={handleLogout}>
              Log out
            </LogoutBtn>
          </NavLinks>
        </>
      )}
    </Screen>
  );
}

export default DashboardPage;
