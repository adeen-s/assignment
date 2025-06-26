import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { TextField as MuiTextField } from '@mui/material';
import type { TextFieldConfig } from '../../types/form-schema';

interface TextFieldProps {
  config: TextFieldConfig;
}

/**
 * Text field component for rendering text inputs in the form
 * Integrates with React Hook Form for validation and state management
 * 
 * @param {TextFieldProps} props - The component props
 * @param {TextFieldConfig} props.config - The field configuration from schema
 * @returns {React.ReactElement} A controlled Material-UI TextField component
 */
function TextFieldComponent({ config }: TextFieldProps) {
  // Get form context from parent FormProvider
  const { control, formState: { errors } } = useFormContext();
  const error = errors[config.name];

  return (
    <Controller
      name={config.name}
      control={control}
      render={({ field }) => (
        <MuiTextField
          {...field}
          label={`${config.label}${config.required ? ' *' : ''}`}
          fullWidth
          error={!!error}
          helperText={error?.message as string}
          placeholder={config.placeholder}
          disabled={config.disabled}
          autoFocus={config.autoFocus}
          inputProps={{
            'aria-required': config.required,
            'aria-label': config.ariaLabel || config.label,
            maxLength: config.maxLength,
            readOnly: config.readOnly,
          }}
        />
      )}
    />
  );
}

// Memoize component to prevent unnecessary re-renders
export const TextField = React.memo(TextFieldComponent);