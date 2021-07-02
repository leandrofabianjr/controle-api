import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  UnauthorizedException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class AuthExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    switch (true) {
      case exception instanceof UnauthorizedException:
        return response
          .status(401)
          .json(this.res('Você não tem permissão para fazer isso.'));

      case exception instanceof InternalServerErrorException:
        return response
          .status(500)
          .json(this.res('Desculpe! Algo de errado aconteceu.'));

      case exception instanceof NotFoundException:
        return response.status(404).json(this.res('Não encontrado'));

      default:
        response
          .status(exception.getStatus())
          .json(this.res(exception.message));
    }
  }

  private res(message: string): { message: string } {
    return { message };
  }
}
