import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import type { DateFieldConfig } from '../../types/form-schema';

interface DateFieldProps {
  config: DateFieldConfig;
}

/**
 * Date field component for date selection
 * Uses MUI DatePicker with dayjs for date handling
 * 
 * @param {DateFieldProps} props - The component props
 * @param {DateFieldConfig} props.config - The field configuration from schema
 * @returns {React.ReactElement} A controlled MUI DatePicker component
 */
function DateFieldComponent({ config }: DateFieldProps) {
  // Get form context from parent FormProvider
  const { control, formState: { errors } } = useFormContext();
  const error = errors[config.name];

  /**
   * Converts dayjs date to native Date object for form state
   * 
   * @param {dayjs.Dayjs | null} date - The dayjs date object from the DatePicker
   * @param {(value: Date | undefined) => void} onChange - Callback function to update the form value
   * @returns {void}
   */
  const handleChange = (
    date: dayjs.Dayjs | null,
    onChange: (value: Date | undefined) => void
  ) => {
    onChange(date?.toDate());
  };

  return (
    <Controller
      name={config.name}
      control={control}
      render={({ field }) => (
        <DatePicker
          label={`${config.label}${config.required ? ' *' : ''}`}
          // Convert Date to dayjs for DatePicker
          value={field.value ? dayjs(field.value) : null}
          onChange={(date) => handleChange(date, field.onChange)}
          disabled={config.disabled}
          readOnly={config.readOnly}
          disableFuture={config.disableFuture}
          disablePast={config.disablePast}
          minDate={config.minDate ? dayjs(config.minDate) : undefined}
          maxDate={config.maxDate ? dayjs(config.maxDate) : undefined}
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!error,
              helperText: error?.message as string,
              placeholder: config.placeholder,
              inputProps: {
                'aria-required': config.required,
                'aria-label': config.ariaLabel || config.label,
              },
            },
          }}
        />
      )}
    />
  );
}

// Memoize component to prevent unnecessary re-renders
export const DateField = React.memo(DateFieldComponent);