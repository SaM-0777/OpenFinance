import { InferSelectModel } from "drizzle-orm";
import { users, accounts, transactions } from "../db/schema";

export type User = InferSelectModel<typeof users>;
export type Account = InferSelectModel<typeof accounts>;
export type Transaction = InferSelectModel<typeof transactions>;

export interface AppError {
  code: string;
  message: string;
  statusCode: number;
}
