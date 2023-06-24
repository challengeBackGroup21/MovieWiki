import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import config from 'config';

const dbConfig = config.get('db');
export const typeORMConfig: TypeOrmModuleOptions = {
  type: dbConfig.type,
  host: process.env.RDS_HOSTNAME || dbConfig.host,
  port: process.env.RDS_PORT || dbConfig.port,
  username: process.env.RDS_USERNAME || dbConfig.username,
  password: process.env.RDS_PASSWORD || dbConfig.password,
  database: process.env.RDS_DB_NAME || dbConfig.database,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: dbConfig.synchronize,
  ssl: {
    rejectUnauthorized: false,
  }, // SSL 옵션을 비활성화
  logging: true,
};

export const testTypeORMConfig: TypeOrmModuleOptions = {
  type: dbConfig.type,
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  database: 'test_db',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  dropSchema: true,
  synchronize: true,
  ssl: false, // SSL 옵션을 비활성화
  logging: true,
};

// export const testTypeORMConfig: TypeOrmModuleOptions = {
//   type: 'postgres',
//   host: 'localhost',
//   port: 5432,
//   username: 'postgres',
//   password: 'marx1818ch!',
//   database: 'MovieWikiTest',
//   entities: [__dirname + '/../**/*.entity.{js,ts}'],
//   dropSchema: true,
//   synchronize: true,
//   ssl: false, // SSL 옵션을 비활성화
//   logging: true,
// };
