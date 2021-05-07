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
  @Get('/')
  @Render('login')
  index() {
    return;
  }

  @UseGuards(LoginGuard)
  @Post('/login')
  login(@Res() res: Response): void {
    console.log('foi');
    res.redirect('/home');
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/home')
  @Render('home')
  getHome() {
    return;
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/profile')
  @Render('profile')
  getProfile() {
    return;
  }

  @Get('/logout')
  logout(@Request() req, @Res() res: Response): void {
    req.logout();
    res.redirect('/');
  }
}
