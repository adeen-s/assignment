import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { TextField } from '@mui/material';
import type { TextareaFieldConfig } from '../../types/form-schema';

interface TextareaFieldProps {
  config: TextareaFieldConfig;
}

/**
 * Textarea field component for multi-line text input
 * Renders a Material-UI TextField with multiline enabled
 * 
 * @param {TextareaFieldProps} props - The component props
 * @param {TextareaFieldConfig} props.config - The field configuration from schema
 * @returns {React.ReactElement} A controlled Material-UI TextField with multiline support
 */
function TextareaFieldComponent({ config }: TextareaFieldProps) {
  // Get form context from parent FormProvider
  const { control, formState: { errors } } = useFormContext();
  const error = errors[config.name];

  return (
    <Controller
      name={config.name}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          label={`${config.label}${config.required ? ' *' : ''}`}
          fullWidth
          multiline
          rows={config.rows || 4}
          minRows={config.minRows}
          maxRows={config.maxRows}
          error={!!error}
          helperText={error?.message as string}
          placeholder={config.placeholder}
          disabled={config.disabled}
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
export const TextareaField = React.memo(TextareaFieldComponent);