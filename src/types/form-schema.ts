/**
 * Form Schema Type Definitions
 * 
 * These are the type definitions for the JSON-driven form system.
 * It allows for declarative form configuration with full type safety.
 */

/**
 * Supported field types in the form system
 */
export type FieldType = 'text' | 'number' | 'currency' | 'date' | 'textarea' | 'select';

/**
 * Base configuration shared by all field types
 */
export interface BaseFieldConfig {
  /** Unique field identifier used for form state management */
  name: string;
  
  /** The type of field to render */
  type: FieldType;
  
  /** Display label for the field */
  label: string;
  
  /** Whether the field is required for form submission */
  required?: boolean;
  
  /** Placeholder text shown when field is empty */
  placeholder?: string;
  
  /** Helper text displayed below the field */
  helperText?: string;
  
  /** Whether the field is disabled */
  disabled?: boolean;
  
  /** Whether the field is read-only */
  readOnly?: boolean;
  
  /** Whether the field should be focused on mount */
  autoFocus?: boolean;
  
  /** Accessibility label for screen readers */
  ariaLabel?: string;
  
  /** Responsive grid configuration */
  grid?: {
    xs?: number;  // Extra small devices (0-600px)
    sm?: number;  // Small devices (600-900px)
    md?: number;  // Medium devices (900-1200px)
    lg?: number;  // Large devices (1200px+)
  };
}

/**
 * Configuration for text input fields
 */
export interface TextFieldConfig extends BaseFieldConfig {
  type: 'text';
  
  /** Minimum character length */
  minLength?: number;
  
  /** Maximum character length */
  maxLength?: number;
  
  /** Regex pattern for validation */
  pattern?: string;
  
  /** Whether to trim whitespace on blur */
  trim?: boolean;
}

/**
 * Configuration for number input fields
 */
export interface NumberFieldConfig extends BaseFieldConfig {
  type: 'number';
  
  /** Minimum allowed value */
  min?: number;
  
  /** Maximum allowed value */
  max?: number;
  
  /** Step increment for number input */
  step?: number;
}

/**
 * Configuration for currency input fields
 */
export interface CurrencyFieldConfig extends BaseFieldConfig {
  type: 'currency';
  
  /** Minimum allowed value */
  min?: number;
  
  /** Maximum allowed value */
  max?: number;
}

/**
 * Configuration for date picker fields
 */
export interface DateFieldConfig extends BaseFieldConfig {
  type: 'date';
  
  /** Minimum selectable date */
  minDate?: string | Date;
  
  /** Maximum selectable date */
  maxDate?: string | Date;
  
  /** Disable future dates */
  disableFuture?: boolean;
  
  /** Disable past dates */
  disablePast?: boolean;
}

/**
 * Configuration for textarea fields
 */
export interface TextareaFieldConfig extends BaseFieldConfig {
  type: 'textarea';
  
  /** Number of visible text rows */
  rows?: number;
  
  /** Minimum number of rows (for auto-sizing) */
  minRows?: number;
  
  /** Maximum number of rows (for auto-sizing) */
  maxRows?: number;
  
  /** Maximum character length */
  maxLength?: number;
}

/**
 * Configuration for select/dropdown fields
 */
export interface SelectFieldConfig extends BaseFieldConfig {
  type: 'select';
  
  /** Options for the select dropdown */
  options: Array<{
    value: string;
    label: string;
  }>;
  
  /** Default selected value */
  defaultValue?: string;
  
  /** Allow multiple selections */
  multiple?: boolean;
}

/**
 * Union type of all possible field configurations
 */
export type FieldConfig = 
  | TextFieldConfig 
  | NumberFieldConfig 
  | CurrencyFieldConfig 
  | DateFieldConfig 
  | TextareaFieldConfig
  | SelectFieldConfig;

/**
 * Group of fields rendered together
 */
export interface FieldGroup {
  /** Array of field configurations in this group */
  fields: FieldConfig[];
  
  /** Layout direction for the field group */
  direction?: 'row' | 'column';
  
  /** Spacing between fields in the group */
  spacing?: number;
}

/**
 * Form section containing multiple field groups
 */
export interface FormSection {
  /** Unique section identifier */
  id: string;
  
  /** Optional section title */
  title?: string;
  
  /** Optional section description */
  description?: string;
  
  /** Groups of fields within this section */
  groups: FieldGroup[];
}

/**
 * Form action button configuration
 */
export interface FormAction {
  /** Unique action identifier */
  id: string;
  
  /** Button label text */
  label: string;
  
  /** Type of button action */
  type: 'submit' | 'reset' | 'button';
  
  /** Material-UI button variant */
  variant?: 'text' | 'outlined' | 'contained';
  
  /** Button color theme */
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  
  /** Button size */
  size?: 'small' | 'medium' | 'large';
  
  /** Optional click handler function name */
  onClick?: string;
}

/**
 * Complete form schema configuration
 */
export interface FormSchema {
  /** Unique form identifier */
  id: string;
  
  /** Optional form title */
  title?: string;
  
  /** Optional form description */
  description?: string;
  
  /** Array of form sections */
  sections: FormSection[];
  
  /** Array of form actions (buttons) */
  actions: FormAction[];
  
  /** Layout configuration */
  layout?: {
    /** Maximum form width */
    maxWidth?: number | string;
    
    /** Form padding */
    padding?: number;
    
    /** Spacing between sections */
    spacing?: number;
  };
  
  /** Validation configuration */
  validation?: {
    /** When to trigger validation */
    mode?: 'onBlur' | 'onChange' | 'onSubmit' | 'all';
    
    /** When to re-validate after errors */
    reValidateMode?: 'onBlur' | 'onChange' | 'onSubmit';
  };
}