import React from 'react';
import { render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { FormRenderer } from '../FormRenderer';

const mockSchema = {
  id: 'test-form',
  title: 'Test Form',
  sections: [{
    id: 'test-section',
    groups: [{
      fields: [{
        name: 'testField',
        type: 'text',
        label: 'Test Field',
      }],
    }],
  }],
  actions: [
    { id: 'cancel', label: 'Cancel', type: 'reset' },
    { id: 'submit', label: 'Submit', type: 'submit' },
  ],
};

function TestWrapper() {
  const form = useForm();
  return (
    <FormRenderer
      schema={mockSchema}
      form={form}
      onSubmit={jest.fn()}
    />
  );
}

describe('FormRenderer', () => {
  it('renders form title', () => {
    render(<TestWrapper />);
    expect(screen.getByText('Test Form')).toBeInTheDocument();
  });

  it('renders action buttons', () => {
    render(<TestWrapper />);
    expect(screen.getByRole('button', { name: /reset form/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit form/i })).toBeInTheDocument();
  });
});