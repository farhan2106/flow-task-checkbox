import { RedisClientType } from "@redis/client";
import { createClient } from "redis";

class RedisClientWrapper {
  private static instance: RedisClientWrapper;
  private client: RedisClientType | undefined;

  private constructor() {
    createClient({
      socket: {
        host: process.env.CACHE_HOST,
        port: process.env.CACHE_PORT as any,
      },
    })
      .on('error', err => console.error('Redis Client Error', err))
      .connect().then(client => {
        this.client = client as any;
      }).catch(err => console.error('Redis Client Error', err));;
  }

  static getInstance(): RedisClientWrapper {
    if (!RedisClientWrapper.instance) {
      RedisClientWrapper.instance = new RedisClientWrapper();
    }
    return RedisClientWrapper.instance;
  }

  async disconnect(force: boolean = false) {
    if (force) {
      await this.client?.disconnect();
    } else {
      await this.client?.quit();
    }
  }
}

export const redisClient = RedisClientWrapper.getInstance();
