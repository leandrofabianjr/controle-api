import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { UserCreateDto } from 'src/common/dto/user-create.dto';
import { validate } from 'class-validator';
import { User } from 'src/common/entities/user.entity';
import { ServiceException } from 'src/common/exceptions/service.exception';

const SALT_ROUNDS = 10;

export class AuthServiceException extends ServiceException {}

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

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
      throw new AuthServiceException({ message, dto, errors });
    }

    dto.password = hashedPassword;

    const user = this.usersService.create(dto);

    if (!user) {
      const message = 'Desculpe! Não foi possível criar o usuário';
      throw new AuthServiceException({ dto, message });
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
}
