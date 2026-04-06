import type { Row } from "../core/storage/db.js";

export interface iFriend extends Row {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  balance: number;
}