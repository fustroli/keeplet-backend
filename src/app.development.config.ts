import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { dbConfig } from './config';
import { join } from 'path';

const databaseConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  username: dbConfig.USERNAME,
  password: dbConfig.PASSWORD,
  database: dbConfig.DATABASE_DEV,
  entities: [join(__dirname, '**/**.entity{.ts,.js}')],
  logging: false,
  synchronize: true,
};

export default databaseConfig;
