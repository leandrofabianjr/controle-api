import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService, AuthServiceException } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async createUserPost(@Body() body, @Res() res: Response): Promise<any> {
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

      return res.render('signup.hbs', context);
    }
  }
}
