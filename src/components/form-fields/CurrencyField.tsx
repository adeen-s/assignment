import React, { useMemo } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { TextField } from '@mui/material';
import currency from 'currency.js';
import type { CurrencyFieldConfig } from '../../types/form-schema';
import { getCurrencyInfo } from '../../utils/currencies';
import type { CurrencyCode } from '../../utils/currencies';

interface CurrencyFieldProps {
  config: CurrencyFieldConfig;
}

/**
 * Currency field component for handling monetary input
 * Automatically formats numbers as currency and strips non-numeric characters
 * 
 * @param {CurrencyFieldProps} props - The component props
 * @param {CurrencyFieldConfig} props.config - The field configuration from schema
 * @returns {React.ReactElement} A controlled Material-UI TextField with currency formatting
 */
function CurrencyFieldComponent({ config }: CurrencyFieldProps) {
  // Get form context from parent FormProvider
  const { control, formState: { errors } } = useFormContext();
  const error = errors[config.name];

  // State to track if field is focused
  const [isFocused, setIsFocused] = React.useState(false);

  // Watch the currency field to get the selected currency
  const selectedCurrency = useWatch({
    control,
    name: 'currency',
    defaultValue: 'USD',
  }) as CurrencyCode;

  // Get currency information
  const currencyInfo = getCurrencyInfo(selectedCurrency);

  // Create currency formatter using currency.js
  // Memoized to prevent recreation on every render
  const formatValue = useMemo(
    () => (value: number) => {
      if (!value) return '';
      
      return currency(value, {
        symbol: currencyInfo?.symbol || '$',
        precision: 2,
        pattern: `! #`,
        negativePattern: `-! #`,
      }).format();
    },
    [currencyInfo?.symbol]
  );

  /**
   * Handles input change by stripping non-numeric characters and converting to number
   * 
   * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} e - The change event from the input
   * @param {(value: number) => void} onChange - Callback function to update the form value
   * @returns {void}
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    onChange: (value: number) => void
  ) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    onChange(value ? parseInt(value, 10) : 0);
  };

  return (
    <Controller
      name={config.name}
      control={control}
      render={({ field }) => (
        <TextField
          label={`${config.label}${config.required ? ' *' : ''}`}
          fullWidth
          error={!!error}
          helperText={error?.message as string}
          placeholder={config.placeholder}
          disabled={config.disabled}
          autoFocus={config.autoFocus}
          // Show raw value when focused, formatted value when not focused
          value={isFocused ? (field.value || '') : (field.value ? formatValue(field.value) : '')}
          onChange={(e) => handleChange(e, field.onChange)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          inputProps={{
            'aria-required': config.required,
            'aria-label': config.ariaLabel || config.label,
            readOnly: config.readOnly,
          }}
        />
      )}
    />
  );
}

// Memoize component to prevent unnecessary re-renders
export const CurrencyField = React.memo(CurrencyFieldComponent);