import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    async createUser(@Body() dto: CreateUserDto) {
        return await this.userService.save(dto)
    }

    @Get(':idOrLogin')
    async findOneUser(@Param('idOrLogin') idOrLogin: string) {
        return await this.userService.findOne(idOrLogin)
    }
    
    @Delete('delete-all-refresh') 
    async deleteAllRefresh() {
        return await this.userService.removeAllRefresh()
    }

    @Delete(':id')
    deleteUser(@Param('id') id: number) {
        return this.userService.delete(Number(id))
    }

    
}
