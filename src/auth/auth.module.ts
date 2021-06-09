import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { SessionSerializer } from './session.serializer';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import JwtConfig from 'src/jwt.config';

@Module({
  imports: [UsersModule, PassportModule, JwtModule.register(JwtConfig())],
  providers: [AuthService, LocalStrategy, SessionSerializer],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
