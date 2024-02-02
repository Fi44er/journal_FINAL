import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';
import { RegisterUserDto } from './dto/register.dto';
import { LogiUserDto } from './dto/login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() dto: RegisterUserDto) {
        const user = await this.authService.register(dto)
        if (!user) throw new BadRequestException('Не получается зарегестрировать пользователя с введенными данными')
        return user
    }

    @Post('login')
    async login(@Body() dto: LogiUserDto) {
        const tokens = await this.authService.login(dto)
        if (!tokens) throw new BadRequestException('Не получается залогиниться с введенными данными')
        return { accessToken: tokens.accessToken }
    }

    @Get('refresh')
    refreshToken() { }
}
