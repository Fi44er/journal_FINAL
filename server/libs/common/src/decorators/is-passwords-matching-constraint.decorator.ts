import { RegisterUserDto } from 'src/services/auth/dto/register.dto';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'IsPasswordsMatching', async: false })
export class IsPasswordsMatchingConstraint implements ValidatorConstraintInterface {
    validate(passwordRepeat: string, args: ValidationArguments) {
        const obj = args.object as RegisterUserDto;
        return obj.password === passwordRepeat;
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return 'Пароли не совпадают';
    }
}