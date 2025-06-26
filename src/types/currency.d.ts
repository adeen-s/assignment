declare module 'currency.js' {
  interface Options {
    symbol?: string;
    separator?: string;
    decimal?: string;
    precision?: number;
    pattern?: string;
    negativePattern?: string;
    format?: (currency: Currency, options?: Options) => string;
  }

  interface Currency {
    add(value: number | string | Currency): Currency;
    subtract(value: number | string | Currency): Currency;
    multiply(value: number | string | Currency): Currency;
    divide(value: number | string | Currency): Currency;
    value: number;
    intValue: number;
    format(options?: Options): string;
  }

  function currency(value: number | string | Currency, options?: Options): Currency;

  export = currency;
}