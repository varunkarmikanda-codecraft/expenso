export class ExistsError extends Error {
    conflictKeys: string[];

    constructor(message: string, conflictKeys: string[]) {
        super(message);
        this.conflictKeys = conflictKeys;

    }
}