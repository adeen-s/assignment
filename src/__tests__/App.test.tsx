import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders employment form', () => {
  render(<App />);
  const formTitle = screen.getByText(/Edit Life Event/i);
  expect(formTitle).toBeInTheDocument();
});