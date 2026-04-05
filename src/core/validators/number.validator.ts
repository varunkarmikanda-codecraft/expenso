import type { ValidationResult, ValidatorFn } from "./validator.types.js";

export const numberValidator: ValidatorFn = (input: string): ValidationResult => {
  if(!(!isNaN(+input))) {
    return 'Please enter a number'
  }
  return true;
}

export const rangeValidator = (min: number, max: number): ValidatorFn => (input: string) => {
  const number = Number(input);
  if(number < min || number > max) {
    return min !== max ? `Please choose an number between ${min} and ${max}.` : `Please choose an number ${ min }`;
  }
  return true;
}