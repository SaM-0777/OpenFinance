import { Worker } from "bullmq";
import redis from "@openfinance/shared/redis/ioredis-config";
import { SEC_COMPANY_QUEUE } from "../constant";
import { getCompanies } from "../../utils/company";
import { SecCompanyHoldingQueue } from "..";

export const SecCompanyWorker = new Worker(
  SEC_COMPANY_QUEUE,
  async (job) => {
    console.log(`[SecCompanyWorker] Processing job ${job.id} (${job.name})`);

    const companies = await getCompanies();

    await SecCompanyHoldingQueue.addBulk(
      companies.map((c) => ({
        name: `sec_company_holding_${c.cik}`,
        data: {
          cik: c.cik,
          link: c.link,
        },
      })),
    );

    return companies;
  },
  {
    connection: redis,
    concurrency: 1,
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

SecCompanyWorker.on("ready", () => {
  console.log("[SecCompanyWorker] Ready");
});

SecCompanyWorker.on("active", (job) => {
  console.log(`[SecCompanyWorker] Job ${job?.id} is active`);
});

SecCompanyWorker.on("completed", (job) => {
  console.log(`[SecCompanyWorker] Job ${job.id} completed`);
});

SecCompanyWorker.on("failed", (job, error) => {
  console.error(`[SecCompanyWorker] Job ${job?.id ?? "unknown"} failed`, error);
});

SecCompanyWorker.on("error", (error) => {
  console.error("[SecCompanyWorker] Worker error", error);
});
