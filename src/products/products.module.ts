import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from 'src/commons/entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonsModule } from 'src/commons/commons.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), CommonsModule],
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}
