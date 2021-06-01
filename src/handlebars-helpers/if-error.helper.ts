import { ValidationError } from 'class-validator';

export const ifError = function (inputName: string, options) {
  const errors: ValidationError[] = options?.data?.root?.errors ?? [];
  const error = errors.find((e) => e.property == inputName);

  return error ? options.fn(this) : options.inverse(this);
};
