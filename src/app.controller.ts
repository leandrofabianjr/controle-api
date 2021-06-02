import {
  Controller,
  Get,
  Post,
  Render,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthExceptionFilter } from './common/filters/auth-exceptions.filter';
import { AuthenticatedGuard } from './common/guards/authenticated.guard';
import { LoginGuard } from './common/guards/login.guard';
import { ViewsService } from './views/views.service';

@UseFilters(AuthExceptionFilter)
@Controller()
export class AppController {
  constructor(private views: ViewsService) {}

  @Get('')
  index(@Res() res: Response) {
    return res.redirect('/dashboard');
  }

  @Get('signup')
  @Render('signup.hbs')
  createUser(@Req() req): void {
    const context = req.flash('context')[0] || {};
    return { ...context };
  }

  @Get('/login')
  loginGet(@Req() req, @Res() res: Response): void {
    const message = req.flash('error-message');
    return this.views.render(res, 'login', { message });
  }

  @UseGuards(LoginGuard)
  @Post('/login')
  login(@Res() res: Response) {
    return res.redirect('/');
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/dashboard')
  @Render('dashboard')
  dashboard() {
    return;
  }

  @Get('/logout')
  logout(@Req() req, @Res() res: Response): void {
    req.logout();
    return res.redirect('/');
  }
}
