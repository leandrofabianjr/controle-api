import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService, AuthServiceException } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async createUserPost(@Body() body, @Res() res: Response): Promise<any> {
    try {
      const user = await this.authService.signUp(body);
      // TODO: fazer login aqui
      return res.redirect('/');
    } catch (ex) {
      let context = {
        message: 'Não foi possível criar o usuário',
      };

      if (ex instanceof AuthServiceException) {
        context = ex.context;
      }

      console.error(ex);

      return res.render('signup.hbs', context);
    }
  }
}
