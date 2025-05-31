import 'dotenv/config';

export const socialConfig: ISocialConfig = {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_SECRET: process.env.GOOGLE_SECRET || '',
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || '',
};

export interface ISocialConfig {
  GOOGLE_CLIENT_ID: string;
  GOOGLE_SECRET: string;
  GOOGLE_CALLBACK_URL: string;
}
