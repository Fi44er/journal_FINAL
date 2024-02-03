import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from '@common/decorators/public.decorator';
import { UserResponse } from './responses/user.response';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @UseInterceptors(ClassSerializerInterceptor)
    @Post()
    async createUser(@Body() dto: CreateUserDto) {
        const user = await this.userService.save(dto)
        return new UserResponse(user)
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get(':idOrLogin')
    async findOneUser(@Param('idOrLogin') idOrLogin: string) {
        const user = await this.userService.findOne(idOrLogin)
        return new UserResponse(user)
    }

    @Delete('delete-all-refresh')
    async deleteAllRefresh() {
        return await this.userService.removeAllRefresh()
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: number) {
        return this.userService.delete(Number(id))
    }
}
