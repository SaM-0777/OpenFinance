import { SecCompanyQueue } from "../src/queue";
import {
  SEC_COMPANY_QUEUE,
  SEC_COMPANY_SCHEDULER_ID,
} from "../src/queue/constant";

export async function startSecCompanyQueue() {
  try {
    const scheduler = await SecCompanyQueue.getJobScheduler(
      SEC_COMPANY_SCHEDULER_ID,
    );

    if (scheduler) {
      console.info("Queue is already active");
      return;
    }

    const cron = Bun.env.SEC_FETCH_CRON;

    if (!cron) {
      throw new Error("SEC_FETCH_CRON is required");
    }

    const job = await SecCompanyQueue.upsertJobScheduler(
      SEC_COMPANY_SCHEDULER_ID,
      {
        pattern: cron,
      },
      {
        name: SEC_COMPANY_QUEUE,
      },
    );

    return job.opts;
  } catch (error) {
    throw new Error("Error starting queue " + String(error));
  }
}

startSecCompanyQueue()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .then((d) => {
    console.log(d);
    process.exit(0);
  });
