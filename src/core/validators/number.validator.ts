import type { ValidatorFn } from "./validator.types.js";

export const numberValidator: ValidatorFn = (input: string): boolean => {
  return !isNaN(+input);
}