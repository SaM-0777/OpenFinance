import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { appRouter } from "./trpc/router";

// BullMQ Dashboard
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { HonoAdapter } from "@bull-board/hono";
import { serveStatic } from "@hono/node-server/serve-static";
import { basicAuth } from "hono/basic-auth";

import { SecCompanyQueue, SecCompanyHoldingQueue } from "./queue";

const PORT = process.env.PORT;
const BULLMQ_USER = process.env.BULLMQ_USER;
const BULLMQ_PASS = process.env.BULLMQ_PASS;

const app = new Hono();

app.use(logger());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  }),
);

app.use(
  "/api/*",
  trpcServer({
    router: appRouter,
  }),
);

app.get("/health", (c) => {
  return c.json({ status: "ok" }, 200);
});

const bullMQBasePath = "/admin/bull-mq/dashboard";
app.use(
  bullMQBasePath + "/*",
  basicAuth({
    username: BULLMQ_USER!,
    password: BULLMQ_PASS!,
  }),
);

const serverAdapter = new HonoAdapter(serveStatic);
createBullBoard({
  queues: [
    new BullMQAdapter(SecCompanyQueue),
    new BullMQAdapter(SecCompanyHoldingQueue),
  ],
  serverAdapter,
});
serverAdapter.setBasePath(bullMQBasePath);
app.route(bullMQBasePath, serverAdapter.registerPlugin());

export default {
  port: PORT,
  fetch: app.fetch,
};
