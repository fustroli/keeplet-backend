import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

export function Match<T>(
  property: keyof T,
  validationOptions?: ValidationOptions,
) {
  return (object: Object, propertyName: string | symbol) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName as string,
      options: validationOptions,
      constraints: [property],
      validator: MatchConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'Match' })
export class MatchConstraint implements ValidatorConstraintInterface {
  validate<T>(value: T[keyof T], args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as T)[relatedPropertyName];
    return value === relatedValue;
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must match ${args.constraints[0]}`;
  }
}
