import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

@Injectable()
export class HashService {
  async hash(data: string): Promise<string> {
    return bcrypt.hash(data, SALT_ROUNDS);
  }
}
