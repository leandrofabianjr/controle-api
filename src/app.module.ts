import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';
import { ProductsModule } from './products/products.module';
import { MethodOverrideMiddleware } from './commons/method-override.middleware';
import { CustomersModule } from './customers/customers.module';
import { OrdersModule } from './orders/orders.module';
import { CommonsModule } from './commons/commons.module';
import * as dotenv from 'dotenv';

function getDbConnectionData(): TypeOrmModuleOptions {
  dotenv.config();
  return {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    ssl: process.env.DB_SSL == 'true',
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: true,
  };
}

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TypeOrmModule.forRoot(getDbConnectionData()),
    ProductsModule,
    CustomersModule,
    OrdersModule,
    CommonsModule,
  ],
  controllers: [AppController, UsersController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MethodOverrideMiddleware).forRoutes('*');
  }
}
