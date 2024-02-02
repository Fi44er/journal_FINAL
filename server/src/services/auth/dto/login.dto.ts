import { IsString, MinLength } from "class-validator"

export class LogiUserDto {
    @IsString()
    login: string

    @IsString()
    @MinLength(6)
    password: string
}