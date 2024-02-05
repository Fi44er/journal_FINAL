import { ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';

import { UserResponse } from './responses/user.response';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { jwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { RolesGuard } from '../auth/guards/role.guard';
import { Roles } from '@common/decorators';
import { Role } from '@prisma/client';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('user')

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @ApiOperation({ summary: 'Find one user by ID or login' })
    @ApiParam({ name: 'idOrLogin', type: String })
    @ApiResponse({ status: 200, description: 'OK', type: UserResponse })

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
    async deleteUser(@Param('id') id: number, @CurrentUser() user: jwtPayload) {
        return this.userService.delete(Number(id), user)
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Get()
    me(@CurrentUser() user: jwtPayload) {
        return user
    }
}
