import type { ValidatorFn } from "./validator.types.js";

export const nameValidator: ValidatorFn = (input: string): boolean => {
  if(!input) return false;
  const regex = /^[a-zA-z]+(\s+[a-zA-Z]+)*$/;
  return regex.test(input);
}

export const emailValidator: ValidatorFn = (input: string): boolean => {
  if(!input) return true;
  const regex = /^[a-zA-Z0-9-.]+@[a-zA-Z0-9-.]+\.[a-zA-Z]{2,}$/
  return regex.test(input);
}

export const phoneValidator: ValidatorFn = (input: string): boolean => {
  if(!input) return true;
  const regex = /[0-9]{10}/;
  return regex.test(input);
}

export const requiredValidator: ValidatorFn = (input: string): boolean => {
  return input.trim().length > 0;
}