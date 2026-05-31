import { Worker } from "bullmq";
import redis from "@openfinance/shared/redis/ioredis-config";
import { SEC_COMPANY_HOLDING_QUEUE } from "../constant";
import { recordSecCompanyHolding } from "../../providers/sec/fillings/record";

export const SecCompanyHoldingWorker = new Worker(
  SEC_COMPANY_HOLDING_QUEUE,
  async (job) => {
    console.log(
      `[SecCompanyHoldingWorker] Processing job ${job.id} (${job.name})`,
    );

    const data: {
      cik: string;
      link: string;
    } = job.data;

    return await recordSecCompanyHolding({ cik: data.cik, link: data.link });
  },
  {
    connection: redis,
    concurrency: 1,
    limiter: {
      max: 2,
      duration: 60_000,
    },
    removeOnComplete: {
      age: 24 * 60 * 60,
      count: 100,
    },
    removeOnFail: {
      age: 7 * 24 * 60 * 60,
      count: 100,
    },
  },
);

SecCompanyHoldingWorker.on("ready", () => {
  console.log("[SecCompanyHoldingWorker] Ready");
});

SecCompanyHoldingWorker.on("active", (job) => {
  console.log(`[SecCompanyHoldingWorker] Job ${job?.id} is active`);
});

SecCompanyHoldingWorker.on("completed", (job) => {
  console.log(`[SecCompanyHoldingWorker] Job ${job.id} completed`);
});

SecCompanyHoldingWorker.on("failed", (job, error) => {
  console.error(
    `[SecCompanyHoldingWorker] Job ${job?.id ?? "unknown"} failed`,
    error,
  );
});

SecCompanyHoldingWorker.on("error", (error) => {
  console.error("[SecCompanyHoldingWorker] Worker error", error);
});
