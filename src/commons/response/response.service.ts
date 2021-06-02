import { Inject, Injectable, Scope } from '@nestjs/common';
import { Request, Response } from 'express';
import { REQUEST } from '@nestjs/core';
import { User } from 'src/commons/entities/user.entity';

interface AuthenticatedRequest extends Request {
  user?: User;
}

@Injectable({ scope: Scope.REQUEST })
export class ResponseService {
  constructor(@Inject(REQUEST) private req: AuthenticatedRequest) {}

  render(res: Response, view: string, context = {}): void {
    const user = this.req.user;
    const flashContext = this.req.flash('context')[0] || {};
    return res.render(view, { ...context, ...flashContext, user });
  }
}
