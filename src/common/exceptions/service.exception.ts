import { ValidationError } from 'class-validator';

interface ServiceExceptionContext {
  message?: string | ReturnMessage;
  errors?: ValidationError[];
  dto?: any;
}

export class ServiceException extends Error {
  constructor(private context: ServiceExceptionContext) {
    super(context.message.toString());
  }

  getContext(): any {
    return this.context;
  }
}
