import { Hono } from "hono";
import { getSECFillings } from "../controllers/sec";

const secRouter = new Hono();

secRouter.get("/fillings", getSECFillings);

export default secRouter;
