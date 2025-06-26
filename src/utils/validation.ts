import { z } from "zod";

// Constants for validation
const MIN_EMPLOYER_NAME_LENGTH = 1;
const MAX_EMPLOYER_NAME_LENGTH = 100;
const MIN_ANNUAL_INCOME = 1;
const MAX_ANNUAL_INCOME = 1_000_000_000; // 1 billion
const MAX_NOTES_LENGTH = 500;

// Custom error messages
const ERROR_MESSAGES = {
  employerName: {
    required: "Please enter the employer's name",
    tooLong: `Employer name must be less than ${MAX_EMPLOYER_NAME_LENGTH} characters`,
  },
  currency: {
    required: "Please select a currency",
    invalid: "Invalid currency code",
  },
  annualGrossIncome: {
    required: "Please enter the annual gross income",
    invalid: "Annual gross income must only be a number",
    positive: "Annual gross income must be a positive number",
    tooLarge: `Annual gross income must be less than ${MAX_ANNUAL_INCOME.toLocaleString()}`,
  },
  employmentStartDate: {
    required: "Please enter the start date",
    future: "Employment start date cannot be in the future",
  },
  employmentEndDate: {
    beforeStart: "Employment end date must be after the start date",
  },
  notes: {
    tooLong: `Notes must be less than ${MAX_NOTES_LENGTH} characters`,
  },
} as const;

export const employmentSchema = z
  .object({
    employerName: z
      .string()
      .min(MIN_EMPLOYER_NAME_LENGTH, ERROR_MESSAGES.employerName.required)
      .max(MAX_EMPLOYER_NAME_LENGTH, ERROR_MESSAGES.employerName.tooLong)
      .trim(),
    currency: z
      .string()
      .min(1, ERROR_MESSAGES.currency.required)
      .regex(/^[A-Z]{3}$/, ERROR_MESSAGES.currency.invalid),
    annualGrossIncome: z
      .number({
        invalid_type_error: ERROR_MESSAGES.annualGrossIncome.invalid,
      })
      .positive(ERROR_MESSAGES.annualGrossIncome.positive)
      .min(MIN_ANNUAL_INCOME, ERROR_MESSAGES.annualGrossIncome.required)
      .max(MAX_ANNUAL_INCOME, ERROR_MESSAGES.annualGrossIncome.tooLarge),
    employmentStartDate: z
      .date({
        required_error: ERROR_MESSAGES.employmentStartDate.required,
      })
      .refine((date) => date <= new Date(), {
        message: ERROR_MESSAGES.employmentStartDate.future,
      }),
    employmentEndDate: z.date().optional(),
    notes: z
      .string()
      .max(MAX_NOTES_LENGTH, ERROR_MESSAGES.notes.tooLong)
      .optional(),
  })
  .refine(
    (data) => {
      if (
        data.employmentEndDate &&
        data.employmentEndDate <= data.employmentStartDate
      ) {
        return false;
      }
      return true;
    },
    {
      path: ["employmentEndDate"],
      message: ERROR_MESSAGES.employmentEndDate.beforeStart,
    }
  );

export type EmploymentFormData = z.infer<typeof employmentSchema>;