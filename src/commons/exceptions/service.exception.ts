import { ValidationError } from 'class-validator';

interface ServiceExceptionContext {
  message?: string;
  errors?: ValidationError[];
}

export class ServiceException extends Error {
  constructor(private context: ServiceExceptionContext) {
    super(context.message.toString());
  }

  getContext(): any {
    return this.context;
  }
}
