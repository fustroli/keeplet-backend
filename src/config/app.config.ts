import 'dotenv/config';

export const appConfig: IAppConfig = {
  PORT: +(process.env.PORT || 8000),
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
};

export interface IAppConfig {
  PORT: number;
  FRONTEND_URL: string;
}
