import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService, AuthServiceException } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async createUserPost(
    @Body() body,
    @Res() res: Response,
    @Req() req,
  ): Promise<any> {
    try {
      await this.authService.signUp(body);
      return res.redirect('/');
    } catch (ex) {
      let context = {
        message: 'Não foi possível criar o usuário',
      };

      if (ex instanceof AuthServiceException) {
        context = ex.getContext();
      }

      console.error(ex);

      req.flash('context', context);
      return res.redirect('/signup');
    }
  }
}
