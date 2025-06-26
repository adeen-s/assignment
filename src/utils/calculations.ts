import dayjs from 'dayjs';
import currency from 'currency.js';

/**
 * Calculates the total income based on annual income and employment duration
 * @param annualIncome - The annual gross income
 * @param startDate - The employment start date
 * @param endDate - The employment end date (optional, defaults to current date)
 * @returns Total income as a number
 * @throws {Error} If inputs are invalid
 */
export const calculateTotalIncome = (
  annualIncome: number,
  startDate: Date | null,
  endDate: Date | null
): number => {
  try {
    // Validate inputs
    if (typeof annualIncome !== 'number' || isNaN(annualIncome)) {
      throw new Error('Annual income must be a valid number');
    }

    // Return 0 if no start date or income
    if (!startDate || !annualIncome || annualIncome <= 0) {
      return 0;
    }

    const start = dayjs(startDate);
    const end = endDate ? dayjs(endDate) : dayjs();

    // Validate dates
    if (!start.isValid()) {
      throw new Error('Invalid start date');
    }
    if (endDate && !end.isValid()) {
      throw new Error('Invalid end date');
    }
  
    // Ensure end date is after start date
    if (end.isBefore(start)) {
      return 0;
    }
    
    // Calculate the difference in years with decimal precision
    const years = end.diff(start, 'year', true);
    
    // Calculate total income using currency.js for precision
    const total = currency(annualIncome).multiply(years);
    
    return total.value;
  } catch (error) {
    console.error('Error calculating total income:', error);
    return 0;
  }
};