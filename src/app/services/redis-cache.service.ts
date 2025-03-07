import { Injectable } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';
import { RedisClientType, RedisDefaultModules } from 'redis';

type RedisClient = RedisClientType<RedisDefaultModules>;

@Injectable({
  providedIn: 'root'
})
export class RedisCacheService {
  private client: RedisClient | null = null;
  private readonly DEFAULT_EXPIRATION = 600;
  private readonly isServer: boolean;
  private redisAvailable = false;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isServer = isPlatformServer(platformId);

    if (this.isServer) {
      this.initRedisClient();
    }
  }

  private async initRedisClient(): Promise<void> {
    try {
      const { redisClient } = await import('../redis-config.server');
      this.client = redisClient as unknown as RedisClient;

      if (this.client && !this.client.isOpen) {
        await this.client.connect();
        this.redisAvailable = true;
        console.log('Redis client connected successfully');
      }
    } catch (error) {
      this.redisAvailable = false;
      console.error('Failed to initialize Redis client:', error);
      console.warn(
        'Application will continue without Redis caching. Make sure Redis server is running on localhost:6379 or set REDIS_URL environment variable.'
      );
    }
  }

  public async get<T>(key: string): Promise<T | null> {
    if (!this.isServer || !this.client || !this.redisAvailable) {
      if (this.isServer && !this.redisAvailable) {
        console.debug('Redis caching is disabled due to connection issues');
      } else if (this.isServer) {
        console.debug('Redis client not initialized');
      }
      return null;
    }

    try {
      const data = await this.client.get(key);
      if (data) {
        return JSON.parse(data) as T;
      }
    } catch (error) {
      console.error('Error getting data from Redis:', error);
    }

    return null;
  }

  public async set<T>(key: string, value: T, expiration: number = this.DEFAULT_EXPIRATION): Promise<void> {
    if (!this.isServer || !this.client || !this.redisAvailable) {
      return;
    }

    try {
      const serializedValue = JSON.stringify(value);
      await this.client.set(key, serializedValue, { EX: expiration });
    } catch (error) {
      console.error('Error setting data in Redis:', error);
    }
  }

  public async delete(key: string): Promise<void> {
    if (!this.isServer || !this.client || !this.redisAvailable) {
      return;
    }

    try {
      await this.client.del(key);
    } catch (error) {
      console.error('Error deleting data from Redis:', error);
    }
  }

  public async clear(): Promise<void> {
    if (!this.isServer || !this.client || !this.redisAvailable) {
      return;
    }

    try {
      await this.client.flushDb();
    } catch (error) {
      console.error('Error clearing Redis cache:', error);
    }
  }
}
