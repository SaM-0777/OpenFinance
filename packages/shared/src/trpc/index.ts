import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { db } from "../db/index";
import {
  createUserSchema,
  createAccountSchema,
  createTransactionSchema,
} from "../validations/schemas";

const t = initTRPC.create();

export const router = t.router({
  // User procedures
  user: t.router({
    list: t.procedure.query(async () => {
      // Return all users
      return [];
    }),
    create: t.procedure.input(createUserSchema).mutation(async ({ input }) => {
      // Create a new user
      return {
        id: "1",
        ...input,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }),
  }),

  // Account procedures
  account: t.router({
    list: t.procedure.query(async () => {
      // Return all accounts
      return [];
    }),
    create: t.procedure.input(createAccountSchema).mutation(async ({ input }) => {
      // Create a new account
      return {
        id: "1",
        userId: "1",
        ...input,
        balance: input.balance || 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }),
  }),

  // Transaction procedures
  transaction: t.router({
    list: t.procedure.query(async () => {
      // Return all transactions
      return [];
    }),
    create: t.procedure.input(createTransactionSchema).mutation(async ({ input }) => {
      // Create a new transaction
      return {
        id: "1",
        ...input,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }),
  }),
});

export type Router = typeof router;
export { t as trpc };
