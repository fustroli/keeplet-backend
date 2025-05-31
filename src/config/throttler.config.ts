import 'dotenv/config';

export const throttlerConfig: IThrottlerConfig = {
  LIMIT: +(process.env.THROTTLER_LIMIT || 10),
  TTL: +(process.env.THROTTLER_TTL || 60),
};

export interface IThrottlerConfig {
  LIMIT: number;
  TTL: number;
}
