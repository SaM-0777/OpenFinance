import { createTRPCReact } from "@trpc/react-query";

import type { AppRouter } from "@openfinance/server/trpc";

export const trpc = createTRPCReact<AppRouter>();
