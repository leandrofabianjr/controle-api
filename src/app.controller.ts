import {
  Controller,
  Get,
  Post,
  Render,
  Request,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthExceptionFilter } from './common/filters/auth-exceptions.filter';
import { AuthenticatedGuard } from './common/guards/authenticated.guard';
import { LoginGuard } from './common/guards/login.guard';

@UseFilters(AuthExceptionFilter)
@Controller()
export class AppController {
  @Get('')
  index(@Res() res: Response) {
    return res.redirect('/dashboard');
  }

  @Get('signup')
  @Render('signup.hbs')
  createUser(): void {
    return;
  }

  @Get('/login')
  loginGet(@Request() req, @Res() res: Response): void {
    const message = req.flash('error-message');
    res.render('login', { message });
  }

  @UseGuards(LoginGuard)
  @Post('/login')
  login(@Res() res: Response) {
    res.redirect('/');
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/dashboard')
  @Render('dashboard')
  dashboard() {
    return;
  }

  @Get('/logout')
  logout(@Request() req, @Res() res: Response): void {
    req.logout();
    res.redirect('/');
  }
}
