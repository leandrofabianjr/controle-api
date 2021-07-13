import { Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import { ServiceException } from 'src/commons/exceptions/service.exception';
import { PaginatedServiceFilters } from 'src/commons/interfaces/paginated-service-filters';
import { DeepPartial, Raw, Repository } from 'typeorm';

@Injectable()
export abstract class BaseService<T, TDto extends Object> {
  constructor(protected repository: Repository<T>) {}

  private async validateAndBuildModel(data: TDto) {
    const dto = this.buildDto(data);
    const errors = await validate(dto);

    if (errors.length) {
      const message = 'Por favor, confira os dados preenchidos.';
      throw new ServiceException({ message, errors });
    }

    await this.dataValidation(dto);

    const model = this.buildPartial(dto);
    return model;
  }

  abstract buildDto(data: TDto): TDto;

  abstract buildPartial(dto: TDto): DeepPartial<T>;

  async dataValidation(dto: TDto): Promise<void> {}

  get(id: string): Promise<T> {
    return this.repository.findOne(id);
  }

  filter(options?: PaginatedServiceFilters<T>): Promise<T[]> {
    if (options?.search?.length) {
      options.where = {
        name: Raw((v) => `LOWER(${v}) Like LOWER(:value)`, {
          value: `%${options.search}%`,
        }),
      };
      delete options.search;
    }

    return this.repository.find(options);
  }

  async create(data: TDto): Promise<T> {
    const model = await this.validateAndBuildModel(data);
    const entity = this.repository.create(model);
    return this.repository.save(entity);
  }

  async edit(id: string, data: TDto) {
    const customer = await this.get(id);

    if (!customer) {
      const message =
        'O registro não existe. Ao invés de editar, crie um novo.';
      throw new ServiceException({ message });
    }

    const model = await this.validateAndBuildModel(data);
    const entity = this.repository.create({ id, ...model });
    return this.repository.save(entity);
  }
}
