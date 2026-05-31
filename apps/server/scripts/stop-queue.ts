import { SecCompanyQueue } from "../src/queue";
import { SEC_COMPANY_SCHEDULER_ID } from "../src/queue/constant";

export async function stopSecCompanyQueue() {
  try {
    const scheduler = await SecCompanyQueue.getJobScheduler(
      SEC_COMPANY_SCHEDULER_ID,
    );

    if (!scheduler) {
      console.info("Queue is not active");
      return;
    }

    const status = await SecCompanyQueue.removeJobScheduler(
      SEC_COMPANY_SCHEDULER_ID,
    );

    return status;
  } catch (error) {
    throw new Error("Error stopping queue " + String(error));
  }
}

stopSecCompanyQueue()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .then((d) => {
    console.log(d);
    process.exit(0);
  });
