import { JwtModuleOptions } from '@nestjs/jwt';
import * as dotenv from 'dotenv';

export default function JwtConfig(): JwtModuleOptions {
  dotenv.config();
  return {
    secret: process.env.JWT_KEY,
    signOptions: { expiresIn: '60s' },
  };
}
