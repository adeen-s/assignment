import { employmentSchema } from '../validation';

describe('employmentSchema', () => {
  const validData = {
    employerName: 'Acme Corporation',
    currency: 'USD',
    annualGrossIncome: 50000,
    employmentStartDate: new Date('2023-01-01'),
  };

  it('validates correct data', () => {
    const result = employmentSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('requires employer name', () => {
    const data = { ...validData, employerName: '' };
    const result = employmentSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('requires positive income', () => {
    const data = { ...validData, annualGrossIncome: 0 };
    const result = employmentSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('requires employment start date', () => {
    const data = { employerName: 'Test', currency: 'USD', annualGrossIncome: 50000 };
    const result = employmentSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('rejects future start dates', () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const data = { ...validData, employmentStartDate: futureDate };
    const result = employmentSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('validates end date must be after start date', () => {
    const data = {
      ...validData,
      employmentStartDate: new Date('2023-06-01'),
      employmentEndDate: new Date('2023-01-01'),
    };
    const result = employmentSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('accepts optional notes', () => {
    const data = { ...validData, notes: 'Test notes' };
    const result = employmentSchema.safeParse(data);
    expect(result.success).toBe(true);
  });
});