import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class ViewsService {
  render(res: Response, view: string, context: any) {
    const user = null; //TODO pegar usuário logado
    return res.render(view, { ...context, user });
  }
}
