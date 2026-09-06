/**
 * Global styles
 */

import { COLORS } from '../../../shared/src/constants';

export const globalStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html,
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: ${COLORS.background};
    color: ${COLORS.text};
  }

  body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  button {
    cursor: pointer;
    border: none;
    font-family: inherit;
    transition: all 0.3s ease;
  }

  input {
    font-family: inherit;
    font-size: 1rem;
  }

  @media (max-width: 768px) {
    body {
      font-size: 14px;
    }
  }
`;
