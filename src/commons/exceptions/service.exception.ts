import { ValidationError } from 'class-validator';
import ReturnMessage from '../utils/return-message';

interface ServiceExceptionContext {
  message?: string | ReturnMessage;
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
