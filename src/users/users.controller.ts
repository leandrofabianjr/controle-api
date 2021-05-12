import { Body, Controller, Get, Post, Render, Res } from '@nestjs/common';
import { Response } from 'express';
import { validate } from 'class-validator';
import { UserCreateDto } from 'src/common/dto/user-create.dto';
import { UsersService } from './users.service';
import { HashService } from 'src/common/hash/hash.service';

@Controller('/users')
export class UsersController {
  constructor(
    private userService: UsersService,
    private hashService: HashService,
  ) {}

  @Get('create')
  @Render('users/users-create.hbs')
  createUser(): void {
    return;
  }

  @Post('create')
  async createUserPost(@Body() body, @Res() res: Response): Promise<any> {
    try {
      const dto = new UserCreateDto(body);
      const errors = await validate(dto);

      const hashedPassword = await this.hashService.hash(dto.password);

      dto.password = dto.passwordConfirm = '';

      if (errors.length) {
        return res.render('users/users-create.hbs', { dto, errors });
      }

      dto.password = hashedPassword;

      if (!(await this.userService.create(dto))) {
        const message = 'Não foi possível criar o usuário';
        return res.render('users/users-create.hbs', { dto, message });
      }

      return res.redirect('/home');
    } catch (ex) {
      console.error(ex);
      const message = 'Não foi possível criar o usuário';
      return res.render('users/users-create.hbs', { message });
    }
  }
}
