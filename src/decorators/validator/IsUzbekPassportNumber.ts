import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";

@ValidatorConstraint({ async: false })
export class IsUzbekPassportNumberConstraint
  implements ValidatorConstraintInterface
{
  validate(passportNumber: any, args: ValidationArguments) {
    const uzbPassportRegex = /^[A-Z]{2}[0-9]{7}$/; // Adjust this regex based on the actual pattern of Uzbek passport numbers
    return (
      typeof passportNumber === "string" &&
      uzbPassportRegex.test(passportNumber)
    );
  }

  defaultMessage(args: ValidationArguments) {
    return "Passport number ($value) is not a valid Uzbek passport number!";
  }
}

export function IsUzbekPassportNumber(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUzbekPassportNumberConstraint,
    });
  };
}
