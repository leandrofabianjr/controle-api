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
import { JwtAuthGuard } from './commons/guards/jwt-auth.guard';
import { LoginGuard } from './commons/guards/login.guard';
import { ResponseService } from './commons/response/response.service';

@UseFilters(AuthExceptionFilter)
@Controller()
export class AppController {
  constructor(
    private resService: ResponseService,
    private authService: AuthService,
  ) {}

  // @Get('')
  // index(@Res() res: Response) {
  //   return res.redirect('/dashboard');
  // }

  // @Get('signup')
  // createUser(@Res() res: Response): void {
  //   return this.resService.render(res, 'signup');
  // }

  @UseGuards(LoginGuard)
  @Post('/jwt/token')
  async loginJwt(@Req() req, @Res() res: Response) {
    const access = await this.authService.loginJwt(req.user);
    return res.status(200).json(access);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/jwt/check')
  checkJwt(@Res() res: Response) {
    console.log('dentro');
    return res.status(200).json();
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
