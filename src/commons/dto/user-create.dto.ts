import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import ValidationMessages from 'src/commons/validation-messages';
import { Match } from '../match.decorator';

export class UserCreateDto {
  @IsNotEmpty({ message: ValidationMessages.isNotEmpty('Nome') })
  firstName: string;

  @IsNotEmpty({ message: ValidationMessages.isNotEmpty('Sobrenome') })
  lastName: string;

  @IsNotEmpty({ message: ValidationMessages.isNotEmpty('E-mail') })
  @IsEmail({}, { message: ValidationMessages.isEmail('E-mail') })
  email: string;

  @MinLength(6, { message: ValidationMessages.minLength(6, 'Senha') })
  password: string;

  @Match('password', { message: ValidationMessages.passwordConfirmation() })
  passwordConfirm: string;

  constructor(obj: UserCreateDto) {
    this.firstName = obj.firstName;
    this.lastName = obj.lastName;
    this.email = obj.email;
    this.password = obj.password;
    this.passwordConfirm = obj.passwordConfirm;
  }
}
