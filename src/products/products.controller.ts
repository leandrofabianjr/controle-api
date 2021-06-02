import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Render,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ProductCreateDto } from './dto/product-create.dto';
import { ProductServiceException, ProductsService } from './products.service';
import ReturnMessage from '../commons/utils/return-message';
import { Response } from 'express';
import { AuthenticatedGuard } from 'src/commons/guards/authenticated.guard';
import { AuthExceptionFilter } from 'src/commons/filters/auth-exceptions.filter';
import { ResponseService } from 'src/commons/response/response.service';

@Controller('products')
@UseGuards(AuthenticatedGuard)
@UseFilters(AuthExceptionFilter)
export class ProductsController {
  constructor(
    private resService: ResponseService,
    private productsService: ProductsService,
  ) {}

  @Get('')
  async index(@Res() res) {
    const products = await this.productsService.filter();

    this.resService.render(res, 'products/index.hbs', { products });
  }

  @Get('create')
  create(@Res() res) {
    return this.resService.render(res, 'products/create.hbs');
  }

  @Post('')
  async store(
    @Body() body: ProductCreateDto,
    @Req() req,
    @Res() res: Response,
  ) {
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

    req.flash('context', context);
    return res.redirect(`/products/create`);
  }

  @Get(':id/edit')
  async edit(@Param('id') id: string, @Res() res) {
    const product = await this.productsService.get(id);
    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    const dto = ProductCreateDto.fromModel(product);

    return this.resService.render(res, 'products/edit.hbs', { id, dto });
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: ProductCreateDto,
    @Res() res: Response,
    @Req() req,
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
      req.flash('context', context);
      return res.redirect(`/products/${id}/edit`);
    }
  }
}
