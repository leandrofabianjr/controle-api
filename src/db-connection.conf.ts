import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

export default function DbConnectionConf(): TypeOrmModuleOptions {
  dotenv.config();
  const isSSL = process.env.DB_SSL == 'true';
  return {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    ssl: isSSL,
    extra: {
      ssl: isSSL ? { rejectUnauthorized: false } : null,
    },
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: true,
  };
}
