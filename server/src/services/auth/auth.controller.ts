import { BadRequestException, Body, Controller, Get, HttpStatus, Post, Res, UnauthorizedException } from '@nestjs/common';
import { RegisterUserDto } from './dto/register.dto';
import { LogiUserDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { Tokens } from './interfaces/token-interface';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Cookie } from '@common/decorators/cookies.decorator';

const REFRESH_TOKEN = 'refreshtoken'

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService
    ) { }

    @Post('register')
    async register(@Body() dto: RegisterUserDto) {
        const user = await this.authService.register(dto)
        if (!user) throw new BadRequestException('Не получается зарегестрировать пользователя с введенными данными')
        return user
    }

    @Post('login')
    async login(@Body() dto: LogiUserDto, @Res() res: Response) {
        const tokens = await this.authService.login(dto)
        if (!tokens) throw new BadRequestException('Не получается залогиниться с введенными данными')
        this.setRefreshTokenToCookie(tokens, res)
    }

    @Get('refresh-tokens')
    async refreshToken(@Cookie(REFRESH_TOKEN) refreshToken: string, res: Response) {
        if(refreshToken) throw new UnauthorizedException()
        const tokens = await this.authService.refreshTokens(refreshToken)
        if (!tokens) throw new UnauthorizedException()
        this.setRefreshTokenToCookie(tokens, res)

    }

    private setRefreshTokenToCookie(tokens: Tokens, @Res() res: Response) {
        if(!tokens) throw new UnauthorizedException()
        res.cookie(REFRESH_TOKEN, tokens.refreshToken.token, {
            httpOnly: true,
            sameSite: 'lax', // все запросы должны отправляться с того же сайта, где мы находимся    
            expires: new Date(tokens.refreshToken.exp),
            secure: this.configService.get('NODE_ENV', 'development') === 'production',
            path: '/' // путь по которому будут доступны cookie
        })
        res.status(HttpStatus.CREATED).json({accessToken: tokens.accessToken})

    }
}
