import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';
import { ProductsModule } from './products/products.module';
import { MethodOverrideMiddleware } from './commons/method-override.middleware';
import { CustomersModule } from './customers/customers.module';
import { OrdersModule } from './orders/orders.module';
import { CommonsModule } from './commons/commons.module';
import DbConnectionConf from './db-connection.conf';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TypeOrmModule.forRoot(DbConnectionConf()),
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
