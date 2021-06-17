import { Injectable, OnModuleInit } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { UserCreateDto } from 'src/commons/dto/user-create.dto';
import { validate } from 'class-validator';
import { User } from 'src/commons/entities/user.entity';
import { ServiceException } from 'src/commons/exceptions/service.exception';
import * as dotenv from 'dotenv';
import { JwtService } from '@nestjs/jwt';

const SALT_ROUNDS = 10;

export class AuthServiceException extends ServiceException {}

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async onModuleInit(): Promise<void> {
    dotenv.config();
    const email = process.env.DEFAUL_ADMIN_EMAIL;
    const admin = await this.usersService.findOneByEmail(email);
    if (!admin) {
      this.usersService.create({
        email,
        firstName: 'Administrador',
        password: await this.hash(process.env.DEFAUL_ADMIN_PASSW),
        lastName: '',
        passwordConfirm: '',
      });
    }
  }

  async hash(data: string): Promise<string> {
    return bcrypt.hash(data, SALT_ROUNDS);
  }

  async signUp(data: UserCreateDto): Promise<User> {
    const dto = new UserCreateDto(data);
    const errors = await validate(dto);

    const hashedPassword = await this.hash(dto.password);
    dto.password = dto.passwordConfirm = '';

    if (errors.length) {
      const message = 'Por favor, confira os dados preenchidos';
      throw new AuthServiceException({ message, errors });
    }

    dto.password = hashedPassword;

    const user = this.usersService.create(dto);

    if (!user) {
      const message = 'Desculpe! Não foi possível criar o usuário';
      throw new AuthServiceException({ message });
    }

    return user;
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);

    if (user && (await bcrypt.compare(password, user?.password))) {
      delete user.password;
      return user;
    }

    return null;
  }

  async validateUserJwt(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(username);

    if (user && (await bcrypt.compare(password, user?.password))) {
      delete user.password;
      return user;
    }

    return null;
  }

  async loginJwt(user: User) {
    const payload = { sub: user.id };
    return {
      access: this.jwtService.sign(payload),
      user,
    };
  }
}
