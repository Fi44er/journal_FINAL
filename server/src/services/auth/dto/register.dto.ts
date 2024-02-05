import { IsPasswordsMatchingConstraint } from "@common/decorators/is-passwords-matching-constraint.decorator"
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength, Validate } from "class-validator"

export class RegisterUserDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    login: string

    @ApiProperty()
    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    password: string

    @ApiProperty()
    @IsString()
    @MinLength(6)
    @Validate(IsPasswordsMatchingConstraint)
    @IsNotEmpty()
    passwordRepeat: string;
}