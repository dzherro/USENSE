import { createClient } from 'redis';

export const redisClient = createClient({
  url: process.env['REDIS_URL'] || 'redis://localhost:6379'
});

export async function initRedis() {
  try {
    await redisClient.connect();
    console.log('Redis client connected');

    redisClient.on('error', (err) => {
      console.error('Redis Client Error', err);
    });

    return redisClient;
  } catch (error) {
    console.error('Failed to connect to Redis', error);
    throw error;
  }
}

export async function closeRedis() {
  try {
    await redisClient.quit();
    console.log('Redis client disconnected');
  } catch (error) {
    console.error('Failed to disconnect from Redis', error);
  }
}
