import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ProductCreateDto } from './dto/product-create.dto';
import { ProductsService } from './products.service';
import ReturnMessage from '../commons/utils/return-message';
import { Response } from 'express';
import { AuthExceptionFilter } from 'src/commons/filters/auth-exceptions.filter';
import { JwtAuthGuard } from 'src/commons/guards/jwt-auth.guard';
import { ParsePaginatedSearchPipe } from 'src/commons/pipes/parse-paginated-search.pipe';
import { ServiceException } from 'src/commons/exceptions/service.exception';

@UseFilters(AuthExceptionFilter)
@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get('')
  async filter(@Query(new ParsePaginatedSearchPipe()) params) {
    return await this.productsService.filter(params);
  }

  @Get(':id')
  async get(@Param('id') id: string, @Res() res: Response) {
    const product = await this.productsService.get(id);
    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    return res.status(200).json(product);
  }

  @Post('')
  async store(
    @Body() body: ProductCreateDto,
    @Req() req,
    @Res() res: Response,
  ) {
    try {
      const product = await this.productsService.create(body);
      return res.status(201).json(product);
    } catch (ex) {
      console.error(ex);
      res.status(400);

      if (ex instanceof ServiceException) {
        return res.json(ex.getContext());
      }

      const message = 'Erro desconhecido';
      res.json({ message });
    }
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
      if (ex instanceof ServiceException) {
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
