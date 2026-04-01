export const number: ValidatorFn = (input: number) => {
  return !isNaN(input);
}