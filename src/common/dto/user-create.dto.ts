import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import M from 'src/common/validation-messages';
import { Match } from '../match.decorator';

export class UserCreateDto {
  @IsNotEmpty({ message: M.isNotEmpty('Nome') })
  firstName: string;

  @IsNotEmpty({ message: M.isNotEmpty('Sobrenome') })
  lastName: string;

  @IsNotEmpty({ message: M.isNotEmpty('E-mail') })
  @IsEmail({}, { message: M.isEmail('E-mail') })
  email: string;

  @MinLength(6, { message: M.minLength(6, 'Senha') })
  password: string;

  @Match('password', { message: M.passwordConfirmation() })
  passwordConfirm: string;

  constructor(obj: UserCreateDto) {
    this.firstName = obj.firstName;
    this.lastName = obj.lastName;
    this.email = obj.email;
    this.password = obj.password;
    this.passwordConfirm = obj.passwordConfirm;
  }
}
