import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth/auth.service';
import { AuthExceptionFilter } from './commons/filters/auth-exceptions.filter';
import { AuthenticatedGuard } from './commons/guards/authenticated.guard';
import { LoginGuard } from './commons/guards/login.guard';
import { ResponseService } from './commons/response/response.service';

@UseFilters(AuthExceptionFilter)
@Controller()
export class AppController {
  constructor(
    private resService: ResponseService,
    private authService: AuthService,
  ) {}

  @Get('')
  index(@Res() res: Response) {
    return res.redirect('/dashboard');
  }

  @Get('signup')
  createUser(@Res() res: Response): void {
    return this.resService.render(res, 'signup');
  }

  @Get('/login')
  loginGet(@Req() req, @Res() res: Response): void {
    const message = req.flash('error-message');
    return this.resService.render(res, 'login', { message });
  }

  @UseGuards(LoginGuard)
  @Post('/login')
  login(@Res() res: Response) {
    return res.redirect('/');
  }

  @UseGuards(LoginGuard)
  @Post('/login/jwt')
  loginJwt(@Req() req) {
    return this.authService.loginJwt(req.user);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/dashboard')
  dashboard(@Res() res: Response) {
    return this.resService.render(res, 'dashboard', {});
  }

  @Get('/logout')
  logout(@Req() req, @Res() res: Response): void {
    req.logout();
    return res.redirect('/');
  }
}
