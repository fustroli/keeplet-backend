import 'dotenv/config';

export const appConfig: IAppConfig = {
  PORT: +(process.env.PORT || 8000),
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  NODE_ENV: process.env.NODE_ENV || 'development',
};

export interface IAppConfig {
  PORT: number;
  FRONTEND_URL: string;
  NODE_ENV: string; // 'development' | 'production' | 'test'
}
