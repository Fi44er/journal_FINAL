import { ApiProperty } from "@nestjs/swagger"
import { IsString, MinLength } from "class-validator"

export class LogiUserDto {

    @ApiProperty()
    @IsString()
    login: string

    @ApiProperty()
    @IsString()
    @MinLength(6)
    password: string
}