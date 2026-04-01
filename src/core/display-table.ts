import type { iFriend } from "../models/friend.model.js";

export const displayTable = <T>(data: T[]) => {
    console.table(data);
}

