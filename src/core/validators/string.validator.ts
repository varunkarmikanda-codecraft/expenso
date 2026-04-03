import type { ValidationResult, ValidatorFn } from "./validator.types.js";

export const nameValidator: ValidatorFn = (input: string): ValidationResult => {
  if(!input.trim()) return 'Please enter your friends name';
  const regex = /^[a-zA-z]+(\s+[a-zA-Z]+)*$/;
  if(!regex.test(input)) {
    return 'Name can contain only characters';
  }
  return true;
}

export const emailValidator: ValidatorFn = (input: string): ValidationResult => {
  const regex = /^[a-zA-Z0-9-.]+@[a-zA-Z0-9-.]+\.[a-zA-Z]{2,}$/
  if(!regex.test(input)) {
    return 'Please enter a valid email (Ex: example@email.com)';
  }
  return true;
}

export const phoneValidator: ValidatorFn = (input: string): ValidationResult => {
  const regex = /[0-9]{10}/;
  if(!regex.test(input)) {
    return 'Please enter a valid 10 digit phone number (Ex: 6767676767)';
  }
  return true;
}

export const requiredValidator: ValidatorFn = (input: string): ValidationResult => {
  if(!(input.trim().length > 0)) {
    return 'Please enter a query'
  }
  return true;
}