import { z } from "zod";

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(1, "Name is required").optional(),
});

export const accountSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  name: z.string().min(1, "Account name is required"),
  balance: z.number().nonnegative("Balance cannot be negative"),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createAccountSchema = z.object({
  name: z.string().min(1, "Account name is required"),
  balance: z.number().nonnegative("Balance cannot be negative").default(0),
});

export const transactionSchema = z.object({
  id: z.string().uuid(),
  accountId: z.string().uuid(),
  type: z.enum(["income", "expense", "transfer"]),
  amount: z.number().nonnegative("Amount cannot be negative"),
  description: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createTransactionSchema = z.object({
  accountId: z.string().uuid("Invalid account ID"),
  type: z.enum(["income", "expense", "transfer"]),
  amount: z.number().nonnegative("Amount cannot be negative"),
  description: z.string().optional(),
});
