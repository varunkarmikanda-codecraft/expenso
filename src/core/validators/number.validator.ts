import type { ValidationResult, ValidatorFn } from "./validator.types.js";

export const numberValidator: ValidatorFn = (input: string): ValidationResult => {
  if(!(!isNaN(+input))) {
    return 'Please enter a number'
  }
  return true;
}