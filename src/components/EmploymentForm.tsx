import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Typography, Alert, Snackbar } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useDebouncedCallback } from "use-debounce";
import type { EmploymentFormData } from "../utils";
import { calculateTotalIncome, employmentSchema } from "../utils";
import { sanitizeFormData } from "../utils/sanitize";
import { getDefaultCurrency, getCurrencyInfo } from "../utils/currencies";
import { FormRenderer } from "./FormRenderer";
import formSchema from "../config/employment-form-schema.json";
import type { FormSchema } from "../types/form-schema";
import type { ValidationMode, ReValidateMode } from "../types/react-hook-form";
import type { CurrencyCode } from "../utils/currencies";
import currency from 'currency.js';

/**
 * Employment form component that handles employment data collection and processing
 * 
 * @returns {React.ReactElement} The employment form component with form validation and file export functionality
 */
export function EmploymentForm() {
  // UI state for notifications
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [downloadError, setDownloadError] = React.useState<string | null>(null);

  // Get default currency based on user locale
  const defaultCurrency = getDefaultCurrency();

  // Initialize form with React Hook Form
  const form = useForm<EmploymentFormData>({
    resolver: zodResolver(employmentSchema),
    defaultValues: {
      employerName: "",
      currency: defaultCurrency,
      annualGrossIncome: 0,
      notes: "",
    },
    mode: formSchema.validation?.mode as ValidationMode,
    reValidateMode: formSchema.validation?.reValidateMode as ReValidateMode,
  });

  // Watch specific fields for total income calculation
  const watchedFields = useWatch({
    control: form.control,
    name: ["currency", "annualGrossIncome", "employmentStartDate", "employmentEndDate"],
  });

  const [selectedCurrency, annualIncome, startDate, endDate] = watchedFields;

  // State for debounced total income
  const [totalIncome, setTotalIncome] = React.useState('$0');

  /**
   * Debounced calculation to prevent excessive recalculations of total income
   * 
   * @param {CurrencyCode} currencyCode - Selected currency code
   * @param {number} income - Annual income amount
   * @param {Date | null} start - Employment start date
   * @param {Date | null} end - Employment end date
   * @returns {void}
   */
  const debouncedCalculate = useDebouncedCallback(
    (currencyCode: CurrencyCode, income: number, start: Date | null, end: Date | null) => {
      const totalAmount = calculateTotalIncome(income, start, end);
      // Format with selected currency using currency.js
      const currencyInfo = getCurrencyInfo(currencyCode);
      const currencyValue = currency(totalAmount, {
        symbol: currencyInfo?.symbol || '$',
        precision: 2,
        pattern: `! #`,
        negativePattern: `-! #`,
      });
      const formattedTotal = currencyValue.format();
      setTotalIncome(formattedTotal);
    },
    500 // 500ms delay
  );

  // Update total income when watched fields change
  React.useEffect(() => {
    debouncedCalculate(
      (selectedCurrency as CurrencyCode) || 'USD', 
      annualIncome || 0, 
      startDate || null, 
      endDate || null
    );
  }, [selectedCurrency, annualIncome, startDate, endDate, debouncedCalculate]);

  /**
   * Handles form submission by exporting data to JSON file
   * 
   * @param formData - Validated form data
   */
  const handleFormSubmit = async (formData: EmploymentFormData) => {
    try {
      // Sanitize form data to prevent XSS
      const sanitizedData = sanitizeFormData(formData);
      
      // Validate sanitized data before processing
      if (!sanitizedData || typeof sanitizedData !== 'object') {
        throw new Error('Invalid form data');
      }

      // Create JSON blob with sanitized data
      const jsonContent = JSON.stringify(sanitizedData, null, 2);
      const blob = new Blob([jsonContent], { type: "application/json" });
      
      // Generate filename with current date
      const currentDate = new Date().toISOString().split("T")[0];
      const filename = `employment-form-${currentDate}.json`;
      
      // Create download link and trigger download
      const downloadUrl = URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");
      downloadLink.href = downloadUrl;
      downloadLink.download = filename;
      
      // Append to DOM, click, and cleanup
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(downloadUrl);
      
      // Show success notification
      setShowSuccess(true);
    } catch (error) {
      // Handle download errors with specific messages
      if (error instanceof Error) {
        if (error.name === 'SecurityError') {
          setDownloadError("Security error: Cannot download file due to browser restrictions.");
        } else if (error.name === 'QuotaExceededError') {
          setDownloadError("Storage quota exceeded. Please free up space and try again.");
        } else {
          setDownloadError(`Failed to download the form: ${error.message}`);
        }
      } else {
        setDownloadError("An unexpected error occurred. Please try again.");
      }
      console.error("Download error:", error);
    }
  };

  /**
   * Handles form cancellation by resetting success notification
   * 
   * @returns {void}
   */
  const handleFormCancel = () => {
    setShowSuccess(false);
  };

  /**
   * Additional content to display calculated total income
   */
  const totalIncomeDisplay = (
    <Typography 
      variant="h5" 
      sx={{ mt: 2 }}
      aria-live="polite"
      aria-label={`Total calculated income is ${totalIncome}`}
    >
      Total Income: {totalIncome}
    </Typography>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {/* Main form renderer */}
      <FormRenderer
        schema={{
          ...formSchema,
          sections: formSchema.sections.map(section => ({
            ...section,
            groups: section.groups.map(group => ({
              ...group,
              fields: group.fields.map(field => 
                field.name === 'currency' && field.type === 'select'
                  ? { ...field, defaultValue: defaultCurrency }
                  : field
              )
            }))
          }))
        } as FormSchema}
        form={form}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
        additionalContent={totalIncomeDisplay}
      />

      {/* Success notification */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setShowSuccess(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Form saved successfully!
        </Alert>
      </Snackbar>

      {/* Error notification */}
      <Snackbar
        open={!!downloadError}
        autoHideDuration={6000}
        onClose={() => setDownloadError(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setDownloadError(null)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {downloadError}
        </Alert>
      </Snackbar>
    </LocalizationProvider>
  );
}