import { Hono } from "hono";
import { cors } from "hono/cors";
import secRouter from "./routes/sec";

const PORT = Bun.env.PORT || 3001;

const app = new Hono();

app.use(
  cors({
    origin: Bun.env.FRONTEND_URL || "http://localhost:3000",
  }),
);

app.route("/api/sec", secRouter);

app.get("/health", (c) => {
  return c.json({ status: "ok" }, 200);
});

export default {
  port: PORT,
  fetch: app.fetch,
};
