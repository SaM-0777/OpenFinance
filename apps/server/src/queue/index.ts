import { Queue } from "bullmq";
import redis from "@openfinance/shared/redis/ioredis-config";
import "./workers";
import { defaultJobOptions } from "./config";
import { SEC_COMPANY_HOLDING_QUEUE, SEC_COMPANY_QUEUE } from "./constant";

export const SecCompanyQueue = new Queue(SEC_COMPANY_QUEUE, {
  connection: redis,
  defaultJobOptions,
});

export const SecCompanyHoldingQueue = new Queue(SEC_COMPANY_HOLDING_QUEUE, {
  connection: redis,
  defaultJobOptions,
});
