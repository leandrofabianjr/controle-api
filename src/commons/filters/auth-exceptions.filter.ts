import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class AuthExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof UnauthorizedException) {
      const message = 'Você não tem permissão para fazer isso.';
      response.status(401).json({ message });
    }

    if (exception instanceof InternalServerErrorException) {
      const message = 'Erro desconhecido.';
      response.status(500).json({ message });
    }
  }
}
