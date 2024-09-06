import { Redis } from "ioredis";
import { IRedisProvider } from "./redis-types";

export class RedisProvider implements IRedisProvider {
  client: Redis;

  constructor() {
    this.client = new Redis({
      host: String(process.env.REDIS_HOST) || "localhost",
      port: Number(process.env.REDIS_PORT) || 6379,
    });
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }
  async set(key: string, value: string, ttl: number): Promise<void> {
    if (ttl) {
      await this.client.set(key, value, "EX", ttl);
    } else {
      await this.client.set(key, value);
    }
  }
}
