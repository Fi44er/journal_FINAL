import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Get, HttpStatus, Post, Res, UnauthorizedException, UseGuards, UseInterceptors } from '@nestjs/common';
import { RegisterUserDto } from './dto/register.dto';
import { LogiUserDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { Tokens } from './interfaces/token.interface';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Cookie } from '@common/decorators/cookies.decorator';
import { UserAgent } from '@common/decorators/user-agent.decorator';
import { Public } from '@common/decorators/public.decorator';
import { UserResponse } from '../user/responses/user.response';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';


const REFRESH_TOKEN = 'refreshtoken'

@ApiTags('auth')
@Public()
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService
    ) { }

    // ---------------------------- register -------------------------------- //
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Register a new user' })
    @ApiParam({ name: 'dto', type: RegisterUserDto })
    @ApiResponse({ status: 201, description: 'Created', type: UserResponse })
    @UseInterceptors(ClassSerializerInterceptor)
    @Post('register')

    async register(@Body() dto: RegisterUserDto) {
        const user = await this.authService.register(dto)
        if (!user) throw new BadRequestException('Не получается зарегестрировать пользователя с введенными данными')
        return new UserResponse(user)
    }

    // ---------------------------- login -------------------------------- //
    @ApiOperation({ summary: 'Login user' })
    @ApiParam({ name: 'dto', type: LogiUserDto })
    @ApiResponse({ status: 200, description: 'OK' })

    @Post('login')
    async login(@Body() dto: LogiUserDto, @Res() res: Response, @UserAgent() agent: string) {

        const tokens = await this.authService.login(dto, agent)
        if (!tokens) throw new BadRequestException('Не получается залогиниться с введенными данными')
        this.setRefreshTokenToCookie(tokens, res)
    }

    // ---------------------------- logout -------------------------------- //
    @ApiOperation({ summary: 'Logout user' })
    @ApiResponse({ status: 200, description: 'OK' })
    @Get('logout')
    async logout(@Cookie(REFRESH_TOKEN) refreshToken: string, @Res() res: Response) {
        if (!refreshToken) return res.sendStatus(HttpStatus.OK)
        await this.authService.deleteRefreshTokeb(refreshToken)
        res.cookie(REFRESH_TOKEN, '', { httpOnly: true, secure: true, expires: new Date() })
        res.sendStatus(HttpStatus.OK)
    }

    // ------------------------------------------ Tokens ------------------------------------------ //
    @Get('refresh-tokens')
    async refreshToken(@Cookie(REFRESH_TOKEN) refreshToken: string, @Res() res: Response, @UserAgent() agent: string) {
        if (!refreshToken || typeof refreshToken !== 'string') throw new UnauthorizedException()
        const tokens = await this.authService.refreshTokens(refreshToken, agent)
        if (!tokens) throw new UnauthorizedException()
        this.setRefreshTokenToCookie(tokens, res)
    }

    private setRefreshTokenToCookie(tokens: Tokens, res: Response) {
        if (!tokens) throw new UnauthorizedException()
        res.cookie(REFRESH_TOKEN, tokens.refreshToken.token, {
            httpOnly: true,
            sameSite: 'lax', // все запросы должны отправляться с того же сайта, где мы находимся    
            expires: new Date(tokens.refreshToken.exp),
            secure: this.configService.get('NODE_ENV', 'development') === 'production',
            path: '/' // путь по которому будут доступны cookie
        })
        res.status(HttpStatus.CREATED).json({ accessToken: tokens.accessToken })
    }

}
