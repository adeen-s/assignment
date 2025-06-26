import { sanitizeString, sanitizeFormData, validateIncome, validateEmployerName } from '../sanitize';

describe('Sanitization utilities', () => {
  describe('sanitizeString', () => {
    it('escapes HTML special characters', () => {
      expect(sanitizeString('<script>alert("XSS")</script>')).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;');
      expect(sanitizeString("O'Neill & Sons")).toBe("O&#x27;Neill &amp; Sons");
      expect(sanitizeString('"Quoted" Company')).toBe('&quot;Quoted&quot; Company');
    });

    it('returns empty string for non-string input', () => {
      expect(sanitizeString(null as unknown as string)).toBe('');
      expect(sanitizeString(undefined as unknown as string)).toBe('');
      expect(sanitizeString(123 as unknown as string)).toBe('');
    });
  });

  describe('sanitizeFormData', () => {
    it('sanitizes all string fields in form data', () => {
      const data = {
        employerName: '<script>Evil Corp</script>',
        notes: 'Test & notes',
        annualGrossIncome: 50000,
        employmentStartDate: new Date('2023-01-01'),
      };

      const sanitized = sanitizeFormData(data);
      expect(sanitized.employerName).toBe('&lt;script&gt;Evil Corp&lt;&#x2F;script&gt;');
      expect(sanitized.notes).toBe('Test &amp; notes');
      expect(sanitized.annualGrossIncome).toBe(50000);
      expect(sanitized.employmentStartDate).toEqual(new Date('2023-01-01'));
    });
  });

  describe('validateIncome', () => {
    it('validates income range', () => {
      expect(validateIncome(50000)).toBe(true);
      expect(validateIncome(0)).toBe(true);
      expect(validateIncome(-1)).toBe(false);
      expect(validateIncome(1_000_000_001)).toBe(false);
    });
  });

  describe('validateEmployerName', () => {
    it('validates employer name format', () => {
      expect(validateEmployerName('Acme Corporation')).toBe(true);
      expect(validateEmployerName("O'Neill & Sons, Inc.")).toBe(true);
      expect(validateEmployerName('Tech-Co (2023)')).toBe(true);
      expect(validateEmployerName('<script>alert()</script>')).toBe(false);
      expect(validateEmployerName('A'.repeat(101))).toBe(false);
    });
  });
});