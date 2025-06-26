import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormHelperText 
} from '@mui/material';
import type { SelectFieldConfig } from '../../types/form-schema';

interface SelectFieldProps {
  config: SelectFieldConfig;
}

/**
 * Select field component for dropdown selections
 * Renders a Material-UI Select with options from configuration
 * 
 * @param {SelectFieldProps} props - The component props
 * @param {SelectFieldConfig} props.config - The field configuration from schema
 * @returns {React.ReactElement} A controlled Material-UI Select component
 */
function SelectFieldComponent({ config }: SelectFieldProps) {
  // Get form context from parent FormProvider
  const { control, formState: { errors } } = useFormContext();
  const error = errors[config.name];

  return (
    <Controller
      name={config.name}
      control={control}
      defaultValue={config.defaultValue || ''}
      render={({ field }) => (
        <FormControl 
          fullWidth 
          error={!!error}
          disabled={config.disabled}
        >
          <InputLabel id={`${config.name}-label`}>
            {`${config.label}${config.required ? ' *' : ''}`}
          </InputLabel>
          <Select
            {...field}
            labelId={`${config.name}-label`}
            label={`${config.label}${config.required ? ' *' : ''}`}
            inputProps={{
              'aria-required': config.required,
              'aria-label': config.ariaLabel || config.label,
            }}
          >
            {config.options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {error && (
            <FormHelperText>{error.message as string}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}

// Memoize component to prevent unnecessary re-renders
export const SelectField = React.memo(SelectFieldComponent);