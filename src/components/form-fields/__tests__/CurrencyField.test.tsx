import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { CurrencyField } from '../CurrencyField';
import type { CurrencyFieldConfig } from '../../../types/form-schema';

/**
 * Test wrapper component that provides form context
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @returns {React.ReactElement} FormProvider wrapper with test form
 */
function TestWrapper({ children }: { children: React.ReactNode }) {
  const methods = useForm({
    defaultValues: {
      currency: 'USD',
      testField: 0,
    },
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe('CurrencyField', () => {
  const mockConfig: CurrencyFieldConfig = {
    name: 'testField',
    type: 'currency',
    label: 'Test Currency Field',
    required: true,
    placeholder: 'Enter amount',
  };

  it('should show raw value when focused', () => {
    render(
      <TestWrapper>
        <CurrencyField config={mockConfig} />
      </TestWrapper>
    );

    const input = screen.getByLabelText('Test Currency Field *') as HTMLInputElement;
    
    // Type a value
    fireEvent.change(input, { target: { value: '12345' } });
    
    // Focus the input
    fireEvent.focus(input);
    
    // Should show raw value when focused
    expect(input.value).toBe('12345');
  });

  it('should show formatted value when blurred', () => {
    render(
      <TestWrapper>
        <CurrencyField config={mockConfig} />
      </TestWrapper>
    );

    const input = screen.getByLabelText('Test Currency Field *') as HTMLInputElement;
    
    // Type a value
    fireEvent.change(input, { target: { value: '12345' } });
    
    // Blur the input
    fireEvent.blur(input);
    
    // Should show formatted value when blurred
    expect(input.value).toBe('$ 12,345.00');
  });

  it('should strip non-numeric characters during input', () => {
    render(
      <TestWrapper>
        <CurrencyField config={mockConfig} />
      </TestWrapper>
    );

    const input = screen.getByLabelText('Test Currency Field *') as HTMLInputElement;
    
    // Focus to ensure raw value is shown
    fireEvent.focus(input);
    
    // Try to type letters and special characters
    fireEvent.change(input, { target: { value: 'abc123def' } });
    
    // Should only keep numeric characters
    expect(input.value).toBe('123');
  });

  it('should handle empty input correctly', () => {
    render(
      <TestWrapper>
        <CurrencyField config={mockConfig} />
      </TestWrapper>
    );

    const input = screen.getByLabelText('Test Currency Field *') as HTMLInputElement;
    
    // Clear the input
    fireEvent.change(input, { target: { value: '' } });
    
    // Should show empty value
    expect(input.value).toBe('');
    
    // Blur to check formatted value
    fireEvent.blur(input);
    
    // Should still be empty when blurred
    expect(input.value).toBe('');
  });
});