import { IsPasswordMatchingConstraint } from "@common/decorators/is-passwords-matching-constraint.decorator"
import { IsString, MinLength, Validate } from "class-validator"

export class RegisterUserDto {
    @IsString()
    login: string

    @IsString()
    @MinLength(6)
    password: string

    @IsString()
    @MinLength(6)
    @Validate(IsPasswordMatchingConstraint)
    passwordRepeat: string
}