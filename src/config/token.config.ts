import 'dotenv/config';

export const tokenConfig: ITokenConfig = {
  SALT_WORK_FACTOR: +(process.env.SALT_WORK_FACTOR || 10),
};

export interface ITokenConfig {
  SALT_WORK_FACTOR: number;
}
