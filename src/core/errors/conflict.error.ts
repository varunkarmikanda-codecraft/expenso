export class ConflictError extends Error {
    conflictError: string;

    constructor(message: string, conflictError: string) {
        super(message);
        this.name = "ConflictError";
        this.conflictError = conflictError;

    }
}