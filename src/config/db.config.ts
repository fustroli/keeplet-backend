import 'dotenv/config';

export const dbConfig: IDbConfig = {
  HOST: process.env.TYPEORM_HOST || 'localhost',
  PORT: +(process.env.TYPEORM_PORT || 3306),
  USERNAME: process.env.TYPEORM_USERNAME || '',
  PASSWORD: process.env.TYPEORM_PASSWORD || '',
  DATABASE_DEV: process.env.TYPEORM_DATABASE_DEV || '',
};

export interface IDbConfig {
  HOST: string;
  PORT: number;
  USERNAME: string;
  PASSWORD: string;
  DATABASE_DEV: string;
}
