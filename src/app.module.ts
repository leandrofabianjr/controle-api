import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';
import { ProductsModule } from './products/products.module';
import { MethodOverrideMiddleware } from './common/method-override.middleware';

@Module({
  imports: [AuthModule, UsersModule, TypeOrmModule.forRoot(), ProductsModule],
  controllers: [AppController, UsersController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MethodOverrideMiddleware).forRoutes('*');
  }
}
