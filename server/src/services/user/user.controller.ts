import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    createUser(@Body() dto: CreateUserDto) {
        return this.userService.save(dto)
    }

    @Get(':login')
    findOneUser(@Param('login') login: string) {
        return this.userService.findOne(login)
    }

    @Delete(':id')
    deleteUser(@Param('id') id: number) {
        return this.userService.delete(Number(id))
    }
}
