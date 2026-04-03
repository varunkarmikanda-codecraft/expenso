export type ValidationResult = true | string;

export type ValidatorFn = (input: string) => ValidationResult;
