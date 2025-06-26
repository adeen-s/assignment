/**
 * FormRenderer Component
 * 
 * A generic, reusable form renderer that takes a JSON schema and renders a complete form.
 * This component handles form layout, field rendering, and action buttons based on the schema.
 * 
 * Features:
 * - JSON-driven form generation
 * - Responsive grid layout
 * - Automatic field type detection and rendering
 * - Built-in form actions (submit, reset)
 * - Customizable styling through schema
 */

import React from 'react';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import {
  Box,
  Paper,
  Stack,
  Typography,
  Button,
  GridLegacy as Grid,
} from '@mui/material';
import type { FormSchema, FieldConfig } from '../types/form-schema';
import {
  TextField,
  CurrencyField,
  DateField,
  TextareaField,
  SelectField,
} from './form-fields';

/**
 * Props for the FormRenderer component
 */
interface FormRendererProps {
  /** Form schema configuration */
  schema: FormSchema;
  
  /** React Hook Form instance */
  form: UseFormReturn<any>;
  
  /** Form submission handler */
  onSubmit: (data: any) => void;
  
  /** Optional cancel/reset handler */
  onCancel?: () => void;
  
  /** Additional content to render within the form (e.g., computed fields) */
  additionalContent?: React.ReactNode;
}

/**
 * Renders a field based on its type configuration
 * 
 * @param config - Field configuration from schema
 * @returns React component for the field type
 */
function renderField(config: FieldConfig): React.ReactElement | null {
  switch (config.type) {
    case 'text':
      return <TextField key={config.name} config={config} />;
    case 'currency':
      return <CurrencyField key={config.name} config={config} />;
    case 'date':
      return <DateField key={config.name} config={config} />;
    case 'textarea':
      return <TextareaField key={config.name} config={config} />;
    case 'select':
      return <SelectField key={config.name} config={config} />;
    default:
      console.warn(`Unknown field type: ${(config as any).type}`);
      return null;
  }
}

/**
 * Generic form renderer that creates forms from JSON schema
 * 
 * @param {FormRendererProps} props - The component props
 * @param {FormSchema} props.schema - Form schema configuration
 * @param {UseFormReturn} props.form - React Hook Form instance
 * @param {Function} props.onSubmit - Form submission handler
 * @param {Function} [props.onCancel] - Optional cancel/reset handler
 * @param {React.ReactNode} [props.additionalContent] - Additional content to render within the form
 * @returns {React.ReactElement} The rendered form based on the provided schema
 */
export function FormRenderer({
  schema,
  form,
  onSubmit,
  onCancel,
  additionalContent,
}: FormRendererProps) {
  const { handleSubmit, reset, formState: { isSubmitting } } = form;

  /**
   * Handles form reset and optional cancel callback
   * 
   * @returns {void}
   */
  const handleFormReset = () => {
    reset();
    onCancel?.();
  };

  /**
   * Renders a form action button based on its configuration
   * 
   * @param {typeof schema.actions[0]} action - The action configuration from schema
   * @returns {React.ReactElement | null} The rendered button component or null if action type is unknown
   */
  const renderActionButton = (action: typeof schema.actions[0]) => {
    switch (action.type) {
      case 'reset':
        return (
          <Button
            key={action.id}
            variant={action.variant || 'outlined'}
            size={action.size || 'medium'}
            disabled={isSubmitting}
            sx={{ minWidth: 120 }}
            onClick={handleFormReset}
            aria-label="Reset form"
          >
            {action.label}
          </Button>
        );
      
      case 'submit':
        return (
          <Button
            key={action.id}
            variant={action.variant || 'contained'}
            size={action.size || 'medium'}
            disabled={isSubmitting}
            sx={{ minWidth: 120 }}
            type="submit"
            aria-label={isSubmitting ? 'Saving form' : 'Submit form'}
          >
            {isSubmitting ? 'Saving...' : action.label}
          </Button>
        );
      
      default:
        return null;
    }
  };

  /**
   * Renders a form section with its field groups
   * 
   * @param {typeof schema.sections[0]} section - The section configuration from schema
   * @returns {React.ReactElement} The rendered section component with all its fields
   */
  const renderFormSection = (section: typeof schema.sections[0]) => (
    <Box key={section.id}>
      {/* Section Header */}
      {section.title && (
        <Typography 
          variant="h6" 
          sx={{ mb: 2 }}
          component="h2"
          id={`section-${section.id}`}
        >
          {section.title}
        </Typography>
      )}
      
      {section.description && (
        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
          {section.description}
        </Typography>
      )}

      {/* Field Groups */}
      <Stack spacing={section.groups[0]?.spacing || 3}>
        {section.groups.map((group, groupIndex) => (
          <Grid
            key={`${section.id}-group-${groupIndex}`}
            container
            spacing={group.spacing || 2}
            direction={group.direction || 'row'}
          >
            {group.fields.map((fieldConfig) => (
              <Grid
                key={fieldConfig.name}
                item
                xs={fieldConfig.grid?.xs || 12}
                sm={fieldConfig.grid?.sm || fieldConfig.grid?.xs || 12}
                md={fieldConfig.grid?.md || fieldConfig.grid?.sm || fieldConfig.grid?.xs || 12}
                lg={fieldConfig.grid?.lg || fieldConfig.grid?.md || fieldConfig.grid?.sm || fieldConfig.grid?.xs || 12}
              >
                {renderField(fieldConfig)}
              </Grid>
            ))}
          </Grid>
        ))}
      </Stack>
    </Box>
  );

  return (
    <FormProvider {...form}>
      <Box
        sx={{
          bgcolor: '#f5f5f5',
          minHeight: '100vh',
          p: schema.layout?.padding || 4,
        }}
      >
        <Paper
          sx={{
            p: schema.layout?.padding || 4,
            maxWidth: schema.layout?.maxWidth || 800,
            mx: 'auto',
          }}
        >
          {/* Form Header */}
          {schema.title && (
            <Typography 
              variant="h5" 
              sx={{ mb: 3, color: '#666' }}
              component="h1"
              id="form-title"
            >
              {schema.title}
            </Typography>
          )}
          
          {schema.description && (
            <Typography variant="body1" sx={{ mb: 3 }}>
              {schema.description}
            </Typography>
          )}

          {/* Form Body */}
          <form onSubmit={handleSubmit(onSubmit)} aria-labelledby="form-title">
            <Stack spacing={schema.layout?.spacing || 3}>
              {/* Render all sections */}
              {schema.sections.map(renderFormSection)}

              {/* Additional content (e.g., computed fields) */}
              {additionalContent}

              {/* Form Actions */}
              <Stack 
                direction="row" 
                spacing={2} 
                justifyContent="flex-end"
                role="group"
                aria-label="Form actions"
              >
                {schema.actions.map(renderActionButton)}
              </Stack>
            </Stack>
          </form>
        </Paper>
      </Box>
    </FormProvider>
  );
}