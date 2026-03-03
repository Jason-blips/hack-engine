import React from 'react';
import styled from 'styled-components';
import { getPasswordStrength, getPasswordStrengthColor, isWeakPassword } from '../utils/passwordStrength';
import { THEME } from '../constants';

const BarWrap = styled.div`
  margin-top: 6px;
  height: 6px;
  border-radius: 3px;
  background: #eee;
  overflow: hidden;
  display: flex;
  gap: 2px;
`;

const Segment = styled.span`
  flex: 1;
  height: 100%;
  border-radius: 2px;
  background: ${({ $active, $color }) => ($active ? $color : '#eee')};
  transition: background 0.2s;
`;

const Label = styled.span`
  font-size: 12px;
  color: ${({ $weak }) => ($weak ? THEME.error : '#666')};
  margin-top: 4px;
  display: block;
`;

export default function PasswordStrengthBar({ password }) {
  const { level, label } = getPasswordStrength(password);
  const weak = isWeakPassword(password);
  const color = getPasswordStrengthColor(level);

  if (!password) return null;

  return (
    <>
      <BarWrap role="meter" aria-valuenow={level} aria-valuemin={0} aria-valuemax={4} aria-label={`Password strength: ${label}`}>
        {[0, 1, 2, 3, 4].map((i) => (
          <Segment key={i} $active={i <= level} $color={color} />
        ))}
      </BarWrap>
      <Label $weak={weak}>
        {label}
        {weak && ' — This password is commonly used and easy to guess. Choose a stronger one.'}
      </Label>
    </>
  );
}
