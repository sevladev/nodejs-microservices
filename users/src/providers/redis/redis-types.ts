export interface IRedisProvider {
  set(key: string, value: string, ttl: number): Promise<void>;
  del(key: string): Promise<void>;
  get(key: string): Promise<string>;
}
