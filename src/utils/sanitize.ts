/**
 * Utility functions for sanitizing user input to prevent XSS attacks
 */

/**
 * Sanitizes a string by escaping HTML special characters to prevent XSS attacks
 * 
 * @param {string} str - The string to sanitize
 * @returns {string} The sanitized string with HTML entities escaped, or empty string if input is not a string
 */
export function sanitizeString(str: string): string {
  if (typeof str !== 'string') return '';
  
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitizes form data object by escaping all string values to prevent XSS attacks
 * 
 * @template T - The type of the form data object
 * @param {T} data - The form data object to sanitize
 * @returns {T} A new object with all string values sanitized
 * @throws {Error} If data is not a valid object or if sanitization fails
 */
export function sanitizeFormData<T extends Record<string, unknown>>(data: T): T {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid data: Expected an object');
  }

  const sanitized = {} as T;
  
  try {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const value = data[key];
        
        if (typeof value === 'string') {
          sanitized[key] = sanitizeString(value) as T[Extract<keyof T, string>];
        } else if (value instanceof Date) {
          sanitized[key] = value;
        } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          sanitized[key] = sanitizeFormData(value as Record<string, unknown>) as T[Extract<keyof T, string>];
        } else {
          sanitized[key] = value;
        }
      }
    }
  } catch (error) {
    throw new Error(`Failed to sanitize data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  
  return sanitized;
}

/**
 * Validates that income is within acceptable range (0 to 1 billion)
 * 
 * @param {number} income - The income value to validate
 * @returns {boolean} True if income is within valid range, false otherwise
 */
export function validateIncome(income: number): boolean {
  return income >= 0 && income <= 1_000_000_000;
}

/**
 * Validates employer name format to ensure it contains only allowed characters
 * 
 * @param {string} name - The employer name to validate
 * @returns {boolean} True if name format is valid and length <= 100, false otherwise
 */
export function validateEmployerName(name: string): boolean {
  // Allow letters, numbers, spaces, and common business characters
  const validPattern = /^[a-zA-Z0-9\s\-.,&'()]+$/;
  return validPattern.test(name) && name.length <= 100;
}