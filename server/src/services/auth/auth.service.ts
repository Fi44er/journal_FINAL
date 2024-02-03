import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { RegisterUserDto } from './dto/register.dto';
import { UserService } from '../user/user.service';
import { LogiUserDto } from './dto/login.dto';
import { Tokens } from './interfaces/token.interface';
import { compareSync } from 'bcrypt';
import { Token, User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 } from 'uuid';
import { add } from 'date-fns';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name)
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly prismaService: PrismaService
    ) { }

    // Регистрация пользователя
    async register(dto: RegisterUserDto) {
        const user: User = await this.userService.findOne(dto.login).catch(err => {
            this.logger.error(err)
            return null
        })
        if (user) throw new ConflictException('Пользователь с таким login уже существует') // сравнивает два поля
        return this.userService.save(dto).catch(err => {
            this.logger.error(err)
            return null
        })
    }

    // Авторизация пользователя
    async login(dto: LogiUserDto, agent: string): Promise<Tokens> {
        const user: User = await this.userService.findOne(dto.login).catch(err => {
            this.logger.error(err)
            return null
        })
        if (!user || !compareSync(dto.password, user.password)) throw new UnauthorizedException('Не верный логин или пароль') // сравнивает два поля
        return this.generateTokens(user, agent)
    }

    // ------------------------------------------ Tokens ------------------------------------------ //

    // Если refresh токен есть в бд, удаляет его и генерирует новую пару accsess и refresh
    async refreshTokens(refreshToken: string, agent: string): Promise<Tokens> {
        console.log(refreshToken);

        const token = await this.prismaService.token.delete({ where: { token: refreshToken } })
        if (!token) throw new UnauthorizedException()

        const user = await this.userService.findOne(String(token.userId))
        return this.generateTokens(user, agent)
    }

    // Генерация пары accsess и refresh токенов
    private async generateTokens(user: User, agent: string): Promise<Tokens> {
        const accessToken = 'Bearer ' + this.jwtService.sign({
            id: user.id,
            login: user.login,
            roles: user.roles
        })
        const refreshToken = await this.getRefreshToken(user.id, agent)
        return { accessToken, refreshToken }
    }

    // Генерация refresh токена
    private async getRefreshToken(userId: number, agent: string): Promise<Token> {
        const _token = await this.prismaService.token.findFirst({ where: { userId, userAgent: agent } })
        const token = _token?.token ?? ''
        return this.prismaService.token.upsert({
            where: { token },
            update: {
                token: v4(),
                exp: add(new Date(), { months: 1 }),
            },
            create: {
                token: v4(),
                exp: add(new Date(), { months: 1 }),
                userId,
                userAgent: agent
            }
        })
    }
}
