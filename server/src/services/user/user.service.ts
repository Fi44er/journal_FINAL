import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt'
import { jwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { convertToSecondsUtil } from '@common/utils/convert-to-seconds';

@Injectable()
export class UserService {
    constructor(
        private readonly configService: ConfigService,
        private readonly prismaService: PrismaService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }

    // Сохранение пользователя
    async save(user: Partial<User>) {
        const hashPassword = this.hashPassword(user.password)
        return await this.prismaService.user.create({
            data: {
                login: user.login,
                password: hashPassword
            }
        })
    }

    // Поиск пользователя по id или login
    async findOne(idOrLogin: string, isReset = false) {
        const pattern = /^[0-9]+$/;
        if (isReset) {
            await this.cacheManager.del(idOrLogin)
        }
        const user = await this.cacheManager.get<User>(idOrLogin)
        if (!user) {
            const userByDb = await this.prismaService.user.findFirst({
                where: {
                    OR: [
                        pattern.test(idOrLogin) ? { id: Number(idOrLogin) } : { login: String(idOrLogin) }
                    ]
                }
            })
            if (!userByDb) return null


            await this.cacheManager.set(idOrLogin, userByDb, convertToSecondsUtil(this.configService.get('JWT_EXP')))
            return userByDb
        }
        return user
    }

    // Удаление пользователя
    async delete(id: number, user: jwtPayload) {
        if (user.id !== id && !user.roles.includes(Role.ADMIN)) throw new ForbiddenException()
        await Promise.all([this.cacheManager.del(String(id)), this.cacheManager.del(user.login)])
        return await this.prismaService.user.delete({ where: { id }, select: { id: true } })
    }

    // Удаление всех Refresh токенов
    removeAllRefresh() {
        return this.prismaService.token.deleteMany()
    }

    // Хэширование пароля
    private hashPassword(password: string) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
    }
}
