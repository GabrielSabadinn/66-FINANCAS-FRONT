export interface FinancialTransaction {
  id: number;
  userId: number;
  entryType: "C" | "D";
  entryId: number;
  value: number;
  description: string;
  date: string;
  created_at?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  pathImageIcon?: string;
  pathImageBanner?: string;
  createdAt?: string;
}
