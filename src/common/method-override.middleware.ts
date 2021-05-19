import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class MethodOverrideMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    if (['GET', 'POST', 'PUT', 'DELETE'].includes(req?.body?._method)) {
      req.method = req?.body?._method;
    }
    next();
  }
}
