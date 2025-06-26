import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EmploymentForm } from '../EmploymentForm';

describe('EmploymentForm', () => {
  it('renders the form title', () => {
    render(<EmploymentForm />);
    expect(screen.getByText('Edit Life Event')).toBeInTheDocument();
  });

  it('displays total income', () => {
    render(<EmploymentForm />);
    const totalIncome = screen.getByText(/Total Income:/);
    expect(totalIncome).toBeInTheDocument();
  });

  it('has Save and Cancel buttons', () => {
    render(<EmploymentForm />);
    expect(screen.getByRole('button', { name: /submit form/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset form/i })).toBeInTheDocument();
  });
});