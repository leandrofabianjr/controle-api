import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { User } from 'src/commons/entities/user.entity';
import { UserCreateDto } from 'src/commons/dto/user-create.dto';
import { BaseService } from 'src/commons/services/base/base.service';

@Injectable()
export class UsersService extends BaseService<User, UserCreateDto> {
  constructor(@InjectRepository(User) repository: Repository<User>) {
    super(repository);
  }

  async buildDto(data: UserCreateDto): Promise<UserCreateDto> {
    return new UserCreateDto(data);
  }

  async buildPartial(dto: UserCreateDto): Promise<DeepPartial<User>> {
    return dto;
  }

  findOneByEmail(email: string): Promise<User> {
    return this.repository.findOne({ email });
  }
}
