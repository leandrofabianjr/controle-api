import { ValidationError } from 'class-validator';
const _CLASS_NAME = 'is-invalid';

const isInvalidClass = function (inputName: string, options) {
  const errors: ValidationError[] = options?.data?.root?.errors ?? [];
  const error = errors.find((e) => e.property == inputName);

  return error ? _CLASS_NAME : '';
};

export default isInvalidClass;
