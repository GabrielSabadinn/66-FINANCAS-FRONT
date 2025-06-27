export interface FinancialTransaction {
  Id: number;
  UserId: number;
  EntryType: "C" | "D";
  EntryId: number;
  Value: number;
  Description: string;
  Date: string;
  Created_at?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  pathImageIcon?: string;
  pathImageBanner?: string;
  createdAt?: string;
  meta?: number;
}
