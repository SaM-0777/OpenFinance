import IORedis, { type RedisOptions } from "ioredis";

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error("REDIS_URL is required");
}

const baseRedisOptions: RedisOptions = {
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
  lazyConnect: true,
};

export default new IORedis(redisUrl!, {
  ...baseRedisOptions,
});
