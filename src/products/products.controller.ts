import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Render,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ProductCreateDto } from './dto/product-create.dto';
import { ProductServiceException, ProductsService } from './products.service';
import ReturnMessage from '../common/utils/return-message';
import { Response } from 'express';
import { AuthenticatedGuard } from 'src/common/guards/authenticated.guard';
import { AuthExceptionFilter } from 'src/common/filters/auth-exceptions.filter';

@Controller('products')
@UseGuards(AuthenticatedGuard)
@UseFilters(AuthExceptionFilter)
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get('')
  @Render('products/index.hbs')
  async index() {
    const products = await this.productsService.filter();

    return { products };
  }

  @Get(':id/edit')
  @Render('products/edit.hbs')
  async edit(@Param('id') id: string) {
    const product = await this.productsService.get(id);
    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }
    return { id: product.id, dto: ProductCreateDto.fromModel(product) };
  }

  @Get('create')
  @Render('products/create.hbs')
  create() {
    return { label: 'Produtos' };
  }

  @Post('')
  @Render('products/create.hbs')
  async store(@Body() body: ProductCreateDto) {
    let context = {};

    try {
      const product = await this.productsService.create(body);
      const message = ReturnMessage.Success(
        `Produto "${product.name}" criado com sucesso`,
      );
      context = { message };
    } catch (ex) {
      console.error(ex);
      if (ex instanceof ProductServiceException) {
        context = ex.getContext();
      } else {
        const message = ReturnMessage.Danger(
          'Não foi possível criar o produto',
        );
        context = { message };
      }
    }

    return context;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: ProductCreateDto,
    @Res() res: Response,
  ) {
    let context = {};
    try {
      const product = await this.productsService.edit(id, body);
      const message = ReturnMessage.Success(
        `Produto "${product.name}" editado com sucesso`,
      );
      context = { message };
      return res.redirect('/products');
    } catch (ex) {
      console.error(ex);
      if (ex instanceof ProductServiceException) {
        context = ex.getContext();
      } else {
        const message = ReturnMessage.Danger(
          'Não foi possível editar o produto',
        );
        context = { message };
      }
      return res.render('products/edit.hbs', context);
    }
  }
}
