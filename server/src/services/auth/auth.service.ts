import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { RegisterUserDto } from './dto/register.dto';
import { UserService } from '../user/user.service';
import { LogiUserDto } from './dto/login.dto';
import { Tokens } from './interfaces/token-interface';
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
    async login(dto: LogiUserDto): Promise<Tokens> {
        const user: User = await this.userService.findOne(dto.login).catch(err => {
            this.logger.error(err)
            return null
        })
        if (!user || !compareSync(dto.password, user.password)) throw new UnauthorizedException('Не верный логин или пароль') // сравнивает два поля
        return this.generateTokens(user)
    }

    // ------------------------------------------ Tokens ------------------------------------------ //

    // Если refresh токен есть в бд, удаляет его и генерирует новую пару accsess и refresh
    async refreshTokens(refreshToken: string): Promise<Tokens> {
        console.log(refreshToken);

        const token = await this.prismaService.token.delete({ where: { token: refreshToken } })
        if (!token) throw new UnauthorizedException()

        const user = await this.userService.findOne(String(token.userId))
        return this.generateTokens(user)
    }

    // Генерация пары accsess и refresh токенов
    private async generateTokens(user: User): Promise<Tokens> {
        const accessToken = 'Bearer ' + this.jwtService.sign({
            id: user.id,
            login: user.login,
            roles: user.roles
        })
        const refreshToken = await this.getRefreshToken(user.id)
        return { accessToken, refreshToken }
    }

    // Генерация refresh токена
    private async getRefreshToken(userId: number): Promise<Token> {
        return this.prismaService.token.create({
            data: {
                token: v4(),
                exp: add(new Date(), { months: 1 }),
                userId
            }
        })
    }
}
