import type { ValidatorFn } from "./validator.types.js";

export const number: ValidatorFn = (input: string): boolean => {
  return !isNaN(+input);
}