import { IsPasswordsMatchingConstraint } from "@common/decorators/is-passwords-matching-constraint.decorator"
import { IsNotEmpty, IsString, MinLength, Validate } from "class-validator"

export class RegisterUserDto {
    @IsString()
    @IsNotEmpty()
    login: string

    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    password: string


    @IsString()
    @MinLength(6)
    @Validate(IsPasswordsMatchingConstraint)
    @IsNotEmpty()
    passwordRepeat: string;
}