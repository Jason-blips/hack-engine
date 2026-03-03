import styled from 'styled-components';
import { THEME } from '../constants';

const GlobalBanner = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: ${THEME.gradient};
  color: white;
  padding: 15px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

export default GlobalBanner;
