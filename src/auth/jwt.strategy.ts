import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import JwtConfig from 'src/jwt.config';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JwtConfig().secret,
    });
  }

  async validate(payload: any) {
    const userId = payload.sub;
    const user = await this.usersService.findOne(userId);
    if (user) {
      delete user.password;
      return user;
    }
    return null;
  }
}
