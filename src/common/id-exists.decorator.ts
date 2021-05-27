import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function Match(
  className: string,
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [className],
      validator: IdExistsConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'IdExists' })
export class IdExistsConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [className] = args.constraints;
    return true;
  }
}
