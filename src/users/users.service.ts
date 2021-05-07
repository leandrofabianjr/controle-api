import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private readonly users: any[];

  constructor() {
    this.users = [
      {
        userId: 1,
        email: 'user@email.com',
        password: 'user',
        pet: { name: 'alfred', picId: 1 },
      },
      {
        userId: 2,
        email: 'admin@email.com',
        password: 'admin',
        pet: { name: 'gopher', picId: 2 },
      },
    ];
  }

  async findOne(email: string): Promise<any> {
    return this.users.find((user) => user.email === email);
  }
}
