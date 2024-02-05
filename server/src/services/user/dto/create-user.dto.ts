import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto {
    @ApiProperty()
    @IsString()
    login: string

    @ApiProperty()
    @MinLength(6)
    @IsNotEmpty()
    password: string
}