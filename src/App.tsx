import React from 'react';
import { EmploymentForm } from './components/EmploymentForm';
import { ErrorBoundary } from './components/ErrorBoundary';

/**
 * Root application component that renders the employment form with error boundary
 * 
 * @returns {React.ReactElement} The main application component wrapped in an error boundary
 */
function App() {
  return (
    <ErrorBoundary>
      <EmploymentForm />
    </ErrorBoundary>
  );
}

export default App;
