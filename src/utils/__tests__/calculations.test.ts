import { calculateTotalIncome } from '../calculations';

describe('calculateTotalIncome', () => {
  it('returns 0 when start date is null', () => {
    expect(calculateTotalIncome(50000, null, new Date())).toBe(0);
  });

  it('returns 0 when annual income is 0', () => {
    expect(calculateTotalIncome(0, new Date('2023-01-01'), new Date())).toBe(0);
  });

  it('returns 0 when annual income is negative', () => {
    expect(calculateTotalIncome(-50000, new Date('2023-01-01'), new Date())).toBe(0);
  });

  it('calculates income for one year correctly', () => {
    const startDate = new Date('2023-01-01');
    const endDate = new Date('2024-01-01');
    expect(calculateTotalIncome(50000, startDate, endDate)).toBe(50000);
  });

  it('calculates income for partial year', () => {
    const startDate = new Date('2023-01-01');
    const endDate = new Date('2023-07-01');
    // Approximately 6 months = 0.5 years
    const result = calculateTotalIncome(60000, startDate, endDate);
    expect(result).toBeGreaterThan(29000);
    expect(result).toBeLessThan(31000);
  });

  it('handles null end date by using current date', () => {
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);
    const result = calculateTotalIncome(60000, startDate, null);
    // Should be approximately 60000 for one year
    expect(result).toBeGreaterThan(55000);
    expect(result).toBeLessThan(65000);
  });

  it('calculates large numbers correctly', () => {
    const startDate = new Date('2023-01-01');
    const endDate = new Date('2024-01-01');
    expect(calculateTotalIncome(1000000, startDate, endDate)).toBe(1000000);
  });

  it('returns 0 when end date is before start date', () => {
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2023-01-01');
    expect(calculateTotalIncome(50000, startDate, endDate)).toBe(0);
  });
});