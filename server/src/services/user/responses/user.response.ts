import { ApiProperty } from "@nestjs/swagger";
import { $Enums, User } from "@prisma/client";
import { Exclude } from "class-transformer";

export class UserResponse implements User {
    @ApiProperty()
    id: number;
    @ApiProperty()
    login: string;

    @Exclude()
    password: string;
    roles: $Enums.Role[];

    constructor(user: User) {
        Object.assign(this, user)
    }
}