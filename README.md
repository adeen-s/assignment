# Employment Form Assignment

A React-based salary calculation form that allows users to input their employment details and export the data as JSON.

## Technology Stack

- **React 19** - Latest version of React
- **TypeScript** - For type safety and better code maintainability
- **Material-UI** - Component library for consistent UI/UX
- **React Hook Form + Zod** - Performant form handling with schema validation
- **dayjs** - Lightweight date manipulation library
- **Jest & Testing Library** - For unit and integration testing

## Key Features Implemented

- **Error Boundary**: Graceful error handling to prevent application crashes
- **Security**: Input sanitization to prevent XSS attacks and incorrect values
- **Performance**: Debounced calculations and memoized components for optimal performance
- **User Experience**: Real-time validation with clear error messages
- **Code Quality**: JSDoc comments, proper TypeScript types, and organized file structure

## Getting Started

### Prerequisites
- Yarn package manager

### Installation

```bash
# Install dependencies
yarn install

# Start development server
yarn start

# Run tests
yarn test

# Build for production
yarn build
```

The application will be available at http://localhost:3000

## Implementation Details

### Form Configuration
The form structure is defined in `src/config/employment-form-schema.json`, making it easy to modify fields without changing component code.

### Data Flow
1. User inputs are validated in real-time using Zod schemas
2. Total income is calculated dynamically based on employment duration
3. Form data is sanitized before export to ensure security
4. JSON file is generated with formatted data for easy consumption

### Testing Strategy
- Unit tests for utility functions (calculations, validation)
- Integration tests for form components
- Error boundary testing for edge cases
- All tests passing with good coverage of critical paths

## Technical Decisions

- **React Hook Form**: Chosen for its performance benefits and minimal re-renders
- **Zod**: Provides runtime type checking and integrates well with TypeScript
- **Material-UI**: Offers production-ready components with built-in accessibility
- **JSON-driven forms**: Allows for easy form modifications without code changes
- **Error boundaries**: Ensures graceful degradation in production

## Known Limitations

- Date picker compatibility varies across browsers
- Form state is not persisted between sessions
