import { IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    login: string

    @IsNotEmpty()
    password: string
}